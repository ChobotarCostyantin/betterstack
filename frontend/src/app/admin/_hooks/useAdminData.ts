import { useEffect, useState } from 'react';
import { listSoftware } from '@/src/api/software/software.api';
import { listCategories } from '@/src/api/categories/categories.api';
import { listFactors, listMetrics } from '@/src/api/criteria/criteria.api';
import { listUsers } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { Tab, TableRecord } from '../types';

export function useAdminData(activeTab: Tab, isAuthorized: boolean) {
    const [data, setData] = useState<TableRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [trigger, setTrigger] = useState(0);
    const refetch = () => setTrigger((prev) => prev + 1);

    useEffect(() => {
        if (!isAuthorized) return;

        async function loadData() {
            setIsLoading(true);
            try {
                let result: unknown;

                switch (activeTab) {
                    case 'software':
                        result = await listSoftware(browserClient);
                        break;
                    case 'category':
                        result = await listCategories(browserClient);
                        break;
                    case 'criteria': {
                        const metricsRes = await listMetrics(browserClient);
                        const factorsRes = await listFactors(browserClient);

                        const getItems = (res: unknown): TableRecord[] => {
                            if (Array.isArray(res)) return res as TableRecord[];

                            const obj = res as {
                                data?: TableRecord[];
                                items?: TableRecord[];
                            };
                            return obj?.data || obj?.items || [];
                        };

                        const metricsWithType = getItems(metricsRes).map(
                            (m: TableRecord) => ({ ...m, type: 'Metric' }),
                        );

                        const factorsWithType = getItems(factorsRes).map(
                            (f: TableRecord) => ({ ...f, type: 'Factor' }),
                        );

                        result = [...metricsWithType, ...factorsWithType];
                        break;
                    }
                    case 'user':
                        result = await listUsers(browserClient);
                        break;
                }

                const typedResult = result as
                    | { data?: TableRecord[]; items?: TableRecord[] }
                    | TableRecord[];
                const items = Array.isArray(typedResult)
                    ? typedResult
                    : typedResult?.data || typedResult?.items || [];

                setData(items);
            } catch (error) {
                console.error('Error loading data:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [activeTab, isAuthorized, trigger]);

    return { data, isLoading, refetch };
}
