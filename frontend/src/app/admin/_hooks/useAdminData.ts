import { useEffect, useState, useRef } from 'react';
import { listSoftware } from '@/src/api/software/software.api';
import { listCategories } from '@/src/api/categories/categories.api';
import { listFactors, listMetrics } from '@/src/api/criteria/criteria.api';
import { listUsers } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { Tab, TableRecord } from '../types';

export function useAdminData(activeTab: Tab, isAuthorized: boolean) {
    const [data, setData] = useState<TableRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isRefetching, setIsRefetching] = useState(false);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [trigger, setTrigger] = useState(0);

    const prevTabRef = useRef(activeTab);
    useEffect(() => {
        if (prevTabRef.current !== activeTab) {
            setPage(1);
            setData([]);
            setHasMore(true);
            prevTabRef.current = activeTab;
        }
    }, [activeTab]);

    const refetch = () => {
        setPage(1);
        setHasMore(true);
        setTrigger((prev) => prev + 1);
    };

    const loadMore = () => {
        if (!isLoading && !isFetchingNextPage && !isRefetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (!isAuthorized) return;

        async function loadData() {
            const isFirstPage = page === 1;

            if (isFirstPage) {
                if (data.length === 0) setIsLoading(true);
                else setIsRefetching(true);
            } else {
                setIsFetchingNextPage(true);
            }

            try {
                let result: unknown;
                const query = { page, perPage: 10 };

                switch (activeTab) {
                    case 'software':
                        result = await listSoftware(browserClient, query);
                        break;
                    case 'category':
                        result = await listCategories(browserClient, query);
                        break;
                    case 'criteria': {
                        const metricsRes = await listMetrics(
                            browserClient,
                            query,
                        );
                        const factorsRes = await listFactors(
                            browserClient,
                            query,
                        );

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
                        result = await listUsers(browserClient, query);
                        break;
                }

                const typedResult = result as
                    | { data?: TableRecord[]; items?: TableRecord[] }
                    | TableRecord[];

                const items = Array.isArray(typedResult)
                    ? typedResult
                    : typedResult?.data || typedResult?.items || [];

                if (items.length === 0) {
                    setHasMore(false);
                } else if (activeTab !== 'criteria' && items.length < 10) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }

                if (isFirstPage) {
                    setData(items);
                } else {
                    setData((prev) => {
                        const existingIds = new Set(
                            prev.map((i) => `${i.type || ''}-${i.id}`),
                        );
                        const newItems = items.filter(
                            (i) => !existingIds.has(`${i.type || ''}-${i.id}`),
                        );
                        return [...prev, ...newItems];
                    });
                }
            } catch (error) {
                console.error('Error loading data:', error);
                if (isFirstPage) setData([]);
            } finally {
                setIsLoading(false);
                setIsFetchingNextPage(false);
                setIsRefetching(false);
            }
        }

        loadData();
    }, [activeTab, isAuthorized, trigger, page, data.length]);

    return {
        data,
        setData,
        isLoading,
        isRefetching,
        refetch,
        isFetchingNextPage,
        hasMore,
        loadMore,
    };
}
