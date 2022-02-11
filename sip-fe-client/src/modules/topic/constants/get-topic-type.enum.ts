export enum GetTopicType {
    TRENDING = 'Trending',
    NAME = 'Name'
}
export type GetTopicKey = keyof typeof GetTopicType