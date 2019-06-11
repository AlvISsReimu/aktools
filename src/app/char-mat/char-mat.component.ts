import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FetchService } from '../fetch.service';
import { MaterialItem } from '../model/materialitem';

@Component({
  selector: 'app-char-mat',
  templateUrl: './char-mat.component.html',
  styleUrls: ['./char-mat.component.scss']
})
export class CharMatComponent implements OnInit, AfterViewChecked {

  cmMap: any;
  chars = [];
  charByStar: Array<any>;
  charByProf: any;
  mats: { [key: string]: MaterialItem };
  joindChars = [];
  star = 6;
  prof = '辅助';
  char = '';
  selectedChars = [];
  rawMat = {};
  summarizedMats: Array<any>;
  constructor(private fetch: FetchService, private cdRef: ChangeDetectorRef) { }


  ngOnInit() {
    this.fetch.getJson('./assets/data/charMaterials.json').subscribe(data => {
      this.cmMap = data;
      this.chars = Object.keys(data);
      const cbs = [[], [], [], [], [], []];
      const cbp = { 医疗: [], 近卫: [], 先锋: [], 重装: [], 狙击: [], 术师: [], 辅助: [], 特种: [], 其它: [] };
      for (const chn in data) {
        if (data[chn] && data[chn].profession !== '其它') {
          cbs[+data[chn].rarity].push(chn);
          cbp[data[chn].profession].push(chn);
        }
      }
      for (let i = 0; i < cbs.length; i++) {
        cbs[i] = cbs[i].sort((a, b) => a > b ? 1 : (a < b ? -1 : 0));
      }
      for (const p in cbp) {
        if (cbp[p]) {
          cbp[p] = cbp[p].sort((a, b) => a > b ? 1 : (a < b ? -1 : 0));
        }
      }
      this.charByStar = cbs;
      this.charByProf = cbp;
      this.onFilterChange();
      this.selectedChars = this.fetch.getLocalStorage('cm-chars', []);
    });
    this.fetch.getJson('./assets/data/material.json').subscribe(data => {
      this.mats = data;
    });
  }
  onFilterChange() {
    const cs = this.charByStar[this.star - 1];
    const cp = this.charByProf[this.prof];
    // 在已排好序的前提下求交集，时间复杂度n+m
    const joind = [];
    for (let i = 0, j = 0; i < cs.length && j < cp.length;) {
      if (cs[i] > cp[j]) {
        j++;
      } else if (cs[i] < cp[j]) {
        i++;
      } else if (cs[i] === cp[j]) {
        joind.push(cs[i]);
        i++;
        j++;
      }
    }
    this.joindChars = joind;
    if (joind.length > 0) {
      this.char = joind[0];
    }
  }
  onCharAdd() {
    if (!this.selectedChars.includes(this.char)) {
      this.selectedChars.push(this.char);
    }
    this.fetch.setLocalStorage('cm-chars', this.selectedChars);
  }
  onCharRemove(name: string) {
    const index = this.selectedChars.indexOf(name, 0);
    if (index > -1) {
      this.selectedChars.splice(index, 1);
    }
    delete this.rawMat[name];
    this.fetch.setLocalStorage('cm-chars', this.selectedChars);
    this.summaryMats();
  }
  onMatReport(charMat: any) {
    // console.log(charMat);
    this.rawMat[charMat.name] = charMat.mat;
    this.summaryMats();
  }
  addOrCreate(m: any, key: string, val: number) {
    if (key in m) {
      m[key] += val;
    } else {
      m[key] = val;
    }
  }
  summaryMats() {
    const sum = {};
    for (const k in this.rawMat) {
      if (this.rawMat[k]) {
        for (const mid in this.rawMat[k]) {
          if (this.rawMat[k][mid]) {
            this.addOrCreate(sum, mid, this.rawMat[k][mid]);
          }
        }
      }
    }
    const sorted = [];
    for (const k in sum) {
      if (sum[k]) {
        sorted.push({
          id: k,
          count: sum[k]
        });
      }
    }
    sorted.sort((a, b) => this.mats[a.id].rarity > this.mats[b.id].rarity ? -1 :
      (this.mats[a.id].rarity < this.mats[b.id].rarity ? 1 :
        (a.id > b.id ? -1 : (a.id < b.id ? 1 : 0))));
    this.summarizedMats = sorted;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
