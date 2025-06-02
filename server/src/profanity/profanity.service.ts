import { Injectable } from '@nestjs/common';
const BadWordsNext = require('bad-words-next');
const en = require('bad-words-next/lib/en');
const ru = require('bad-words-next/lib/ru');
const ruLat = require('bad-words-next/lib/ru_lat');

@Injectable()
export class ProfanityService {
    private filter: any;

    constructor () {
        this.filter = new BadWordsNext({data: en});
        this.filter.add(en);
        this.filter.add(ru);
        this.filter.add(ruLat);
    }

    containsProfanity(text?: string): boolean {
        if (!text) {
            return false
        }
        return this.filter.check(text);
    }

    clean(text: string): string {
        return this.filter.filter(text);
    }

}
