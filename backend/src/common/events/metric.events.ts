export class MetricDeletedEvent {
    static readonly eventName = 'metric.deleted';

    constructor(public readonly metricId: number) {}
}
