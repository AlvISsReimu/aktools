import { Component, OnInit } from '@angular/core';
import { HrData } from '../model/hrdata';
import { HrComb } from '../model/hrcomb';
import { FetchService } from '../fetch.service';


@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss']
})

export class HrComponent implements OnInit {

  hrdata: HrData;
  hrjson: Array<any>;
  tags: {};
  chars: {};
  selectedTags: Array<string> = [];
  selectedStars: Array<number> = [1, 2, 3, 4, 5, 6];

  onSelectTagChanged(selected: Array<string>): void {
    this.selectedTags = selected;
    this.calculateCombs();
  }
  onSelectStarChanged(selected: Array<number>): void {
    this.selectedStars = selected;
    this.calculateCombs();
  }

  constructor(private fetch: FetchService) { }

  ngOnInit() {
    this.hrdata = new HrData();
    this.hrdata.tagrows = [
      {
        title: '资质', tags: ['新手', '资深干员', '高级资深干员'],
      },
      {
        title: '位置', tags: ['远程位', '近战位'],
      },
      {
        title: '性别', tags: ['男性干员', '女性干员'],
      },
      {
        title: '种类', tags: ['先锋干员', '狙击干员', '医疗干员', '术师干员', '近卫干员', '重装干员', '辅助干员', '特种干员'],
      },
      {
        title: '词缀', tags: ['治疗', '支援', '输出', '群攻', '减速', '生存', '防护', '削弱', '位移', '控场', '爆发', '召唤', '快速复活', '费用回复'],
      }
    ];
    this.hrdata.combs = [];
    this.fetch.getJson('./assets/data/akhr.json').subscribe(data => {
      this.hrjson = data;
      this.chars = {};
      this.tags = {};
      for (const char of data) {
        if (char.hidden) { continue; }
        char.tags.push(char.type + '干员');
        char.tags.push(char.sex + '性干员');
        const name = char.name;
        for (const tag of char.tags) {
          if (tag in this.tags) {
            this.tags[tag].push({ name, img: char['name-en'], level: char.level, type: char.type });
          } else {
            this.tags[tag] = [{ name, img: char['name-en'], level: char.level, type: char.type }];
          }
        }
        this.chars[name] = { level: char.level, tags: char.tags };
      }
    });
  }

  calculateCombs(): void {
    const len = this.selectedTags.length;
    const count = Math.pow(2, this.selectedTags.length);
    const combs = [];
    for (let i = 0; i < count; i++) {
      const ts = [];
      for (let j = 0, mask = 1; j < len; j++) {
        // tslint:disable-next-line: no-bitwise
        if ((i & mask) !== 0) {
          ts.push(this.selectedTags[j]);
        }
        mask = mask * 2;
      }
      combs.push({ tags: ts, score: 0.0, possible: [], id: '' });
    }
    for (const comb of combs) {
      const tags = comb.tags;
      if (tags.length === 0 || tags.length > 3) { continue; }
      let chars = [...this.tags[tags[0]]];
      for (let j = 1; j < tags.length; j++) {
        const reducedChars = [];
        for (const char of chars) {
          for (const tgch of this.tags[tags[j]]) {
            if (char.name === tgch.name) {
              reducedChars.push(char);
              break;
            }
          }
        }
        chars = reducedChars;
      }
      if (chars.length === 0) { continue; }
      if (!tags.includes('高级资深干员')) {
        const reduce6 = [];
        for (const char of chars) {
          if (char.level !== 6) {
            reduce6.push(char);
          }
        }
        chars = reduce6;
      }
      const filteredChars = [];
      for (const char of chars) {
        if (this.selectedStars.includes(char.level)) {
          filteredChars.push(char);
        }
      }
      chars = filteredChars;
      if (chars.length === 0) { continue; }
      comb.possible = chars.sort((a, b) => a.level > b.level ? -1 : (a.level < b.level ? 1 : 0));
      let s = 0;
      for (const char of chars) {
        s += char.level;
      }
      s = s / chars.length;
      comb.score = s + 0.1 / tags.length + 0.9 / chars.length;
      comb.id = tags.join('') + chars.join('');
    }
    combs.sort((a, b) => {
      return a.score > b.score ? -1 : (a.score < b.score ? 1 :
        (a.tags.length > b.tags.length ? 1 : (a.tags.length < b.tags.length ? -1 : 0)));
    });
    this.hrdata.combs = combs.filter(c => c.possible.length > 0);
  }

}
