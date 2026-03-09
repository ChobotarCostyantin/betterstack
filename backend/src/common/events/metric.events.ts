export class MetricDeletedEvent {
    static readonly eventName = 'metric.deleted';

    constructor(public readonly metricId: number) {}
}

export class MetricUpdatedEvent {
    static readonly eventName = 'metric.updated';

    constructor(
        public readonly metricId: number,
        public readonly name: string,
    ) {}
}
