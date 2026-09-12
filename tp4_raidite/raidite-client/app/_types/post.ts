import { Comment } from './comment';

export class Post{
    constructor(
        public id : number,
        public title : string,
        public hubId : number,
        public hubName : string,
        public mainComment : Comment | null,
        public isSaved: boolean
    ){}
}