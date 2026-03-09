export class FactorDeletedEvent {
    static readonly eventName = 'factor.deleted';

    constructor(public readonly factorId: number) {}
}

export class FactorUpdatedEvent {
    static readonly eventName = 'factor.updated';

    constructor(
        public readonly factorId: number,
        public readonly positiveVariant: string,
        public readonly negativeVariant: string,
    ) {}
}
