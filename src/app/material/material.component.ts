import { Component, OnInit } from '@angular/core';
import { FetchService } from '../fetch.service';
import { MdcListItemSecondaryTextDirective } from '@blox/material';
import { MaterialItemData } from '../model/materialitemdata';
import { MaterialInfo } from '../model/materialinfo';
import { MaterialItem } from '../model/materialitem';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  // Options
  options: any;

  // Items data
  items: Array<MaterialInfo>;
  mByLvl: Array<Array<string>>;
  mIdx: { [key: string]: MaterialInfo };
  data: { [key: string]: MaterialItemData };

  calc(): void {
    const counts = {};
    for (const i of this.items) {
      const need = this.data[i.name].need;
      const have = this.data[i.name].have;
      const diff = need - have;
      counts[i.name] = {
        need,
        have_s: have,
        have,
        upper: 0,
        lack: diff > 0 ? diff : 0
      };
    }
    // 稀有度由高到低，生成所有合成路线
    for (let i = 4; i >= 0; i--) {
      for (let j = this.mByLvl[i].length - 1; j >= 0; j--) {
        const m = this.mIdx[this.mByLvl[i][j]];
        const mm = m.madeof;
        for (const k in mm) {
          if (mm[k]) {
            counts[k].upper += mm[k] * counts[m.name].lack;
            const diff = counts[k].need + counts[k].upper - counts[k].have;
            counts[k].lack = diff > 0 ? diff : 0;
          }
        }
      }
    }
    // console.log(counts);
    // 稀有度由低到高，检查现有材料是否能向上合成
    for (let i = 1; i < 5; i++) {
      for (let j = this.mByLvl[i].length - 1; j >= 0; j--) {
        const m = this.mIdx[this.mByLvl[i][j]];
        if (counts[m.name].lack === 0) {
          this.data[m.name].canMerge = false;
          continue;
        }
        let maxCompose = Object.keys(m.madeof).length === 0 ? 0 : Number.MAX_SAFE_INTEGER;
        for (const k in m.madeof) {
          if (counts[k]) {
            const cm = counts[k];
            if (cm.have / m.madeof[k] < maxCompose) {
              maxCompose = cm.have / m.madeof[k];
            }
          }
        }
        maxCompose = Math.floor(maxCompose > counts[m.name].lack ? counts[m.name].lack : maxCompose);
        this.data[m.name].canMerge = maxCompose > 0;
      }
    }
    for (const i of this.items) {
      const name = i.name;
      this.data[name].lack = counts[name].lack;
      this.data[name].have = counts[name].have;
      this.data[name].need = counts[name].need;
    }
    this.fetchService.setLocalStorage('m-data', this.data);
  }

  onMatMerge(name: string) {
    const m = this.mIdx[name];
    for (const k in m.madeof) {
      if (m.madeof[k]) {
        this.data[k].have -= m.madeof[k];
      }
    }
    this.data[name].have += 1;
    this.calc();
  }

  onDataChange(itemData: MaterialItemData) {
    this.data[itemData.name].have = itemData.have;
    this.data[itemData.name].need = itemData.need;
    this.calc();
  }
  onOptionChange() {
    this.fetchService.setLocalStorage('m-option', this.options);
  }

  constructor(private fetchService: FetchService) {
    this.options = this.fetchService.getLocalStorage('m-option', {
      showOnly3plus: true,
      filtered: false,
      showMat: true,
      showBook: true,
      showChip: true
    });
  }

  reset() {
    const data = {};

    for (const item of this.items) {
      data[item.name] = new MaterialItemData(item.name);
    }
    this.data = data;
    this.options = {
      showOnly3plus: true,
      filtered: false,
      showMat: true,
      showBook: true,
      showChip: true
    };
    this.calc();
  }

  ngOnInit() {
    this.fetchService.getJson('./assets/data/material.json').subscribe(data => {
      const items = [];
      this.mByLvl = [];
      const initLacks = {};
      this.mIdx = {};
      for (let i = 0; i < 5; i++) {
        this.mByLvl.push([]);
      }
      const ldata = this.fetchService.getLocalStorage('m-data', {});
      for (const k in data) {
        if (data[k]) {
          const item = data[k];
          items.push(item);
          if (!(item.name in ldata)) { ldata[item.name] = new MaterialItemData(item.name); }
          this.mByLvl[data[k].rarity - 1].push(data[k].name);
          this.mIdx[data[k].name] = data[k];
        }
      }
      this.data = ldata;
      // console.log(ldata);
      this.items = items.sort((a, b) => {
        return a.rarity > b.rarity ? -1 : (a.rarity < b.rarity ? 1 : (a.id > b.id) ? -1 : (a.id < b.id ? 1 : 0));
      });
      this.calc();
    });
  }

  getOrDefault(o: any, k: string, v: any = 0) {
    return k in o ? o[k] : v;
  }

  trackItem(_: any, item: MaterialInfo) {
    return item === null ? null : item.id;
  }

}
