import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FetchService } from '../fetch.service';

@Component({
  selector: 'app-char-mat-charcard',
  templateUrl: './char-mat-charcard.component.html',
  styleUrls: ['./char-mat-charcard.component.scss']
})
export class CharMatCharcardComponent implements OnInit {
  @Input() char: any;

  @Output() reportRemove = new EventEmitter<string>();
  @Output() reportMats = new EventEmitter<any>();

  data: { [key: string]: any } = {
    ce: 0,
    te: 0,
    cs: 1,
    ts: 1,
    specials: [],
    css: [],
    tss: []
  };

  emitRemove() {
    this.reportRemove.emit(this.char.name);
  }
  constructor(private fetch: FetchService) {
  }
  getOrDefault(o: any, k: any, v: any = 0) {
    return k in o ? o[k] : v;
  }
  saveLocal() {
    this.fetch.setLocalStorage('cm-' + this.char.name, this.data);
  }
  ngOnInit() {
    const cml = this.fetch.getLocalStorage('cm-' + this.char.name, {
      ce: 0,
      te: 0,
      cs: 1,
      ts: 1,
      specials: [],
      css: [],
      tss: []
    });
    const specialCount = this.char.sskillCosts.length;
    if (specialCount !== 0) {
      for (let i = 0; i < specialCount; i++) {
        this.data.css.push(cml.css.length > i ? cml.css[i] : 0);
        this.data.tss.push(cml.tss.length > i ? cml.tss[i] : 0);
        this.data.specials.push(i);
      }
    }
    this.calc();
  }

  onEvolveClick(isTarget: boolean, isAdd: boolean) {
    const maxEvolve = this.char.evolveCosts.length - 1;
    if (isTarget) {
      this.data.te = this.checkFix(this.data.te + (isAdd ? 1 : -1), 0, maxEvolve);
    } else {
      this.data.ce = this.checkFix(this.data.ce + (isAdd ? 1 : -1), 0, maxEvolve);
    }
    this.calc();
  }

  onSkillClick(isTarget: boolean, isAdd: boolean) {
    const maxSkill = this.char.askillCosts.length + 1;
    if (isTarget) {
      this.data.ts = this.checkFix(this.data.ts + (isAdd ? 1 : -1), 1, maxSkill);
    } else {
      this.data.cs = this.checkFix(this.data.cs + (isAdd ? 1 : -1), 1, maxSkill);
    }
    this.calc();
  }

  onSpecialClick(idx: number, isTarget: boolean, isAdd: boolean) {
    const maxSpecial = this.char.sskillCosts[idx].levelUpCost.length;
    if (isTarget) {
      this.data.tss[idx] = this.checkFix(this.data.tss[idx] + (isAdd ? 1 : -1), 0, maxSpecial);
    } else {
      this.data.css[idx] = this.checkFix(this.data.css[idx] + (isAdd ? 1 : -1), 0, maxSpecial);
    }
    this.calc();
  }

  addOrCreate(o: any, key: any, val: number) {
    if (key in o) {
      o[key] += val;
    } else {
      o[key] = val;
    }
  }

  calc() {
    const m = {};
    // evolve
    for (let i = this.data.ce + 1; i <= this.data.te; i++) {
      const ec = this.char.evolveCosts[i];
      for (const eci of ec) {
        this.addOrCreate(m, eci.id, eci.count);
      }
    }
    // all skills
    for (let i = this.data.cs; i < this.data.ts; i++) {
      const sc = this.char.askillCosts[i - 1];
      for (const sci of sc.lvlUpCost) {
        this.addOrCreate(m, sci.id, sci.count);
      }
    }
    // specials
    for (const idx of this.data.specials) {
      for (let i = this.data.css[idx]; i < this.data.tss[idx]; i++) {
        const spc = this.char.sskillCosts[idx].levelUpCost[i];
        for (const spci of spc.levelUpCost) {
          this.addOrCreate(m, spci.id, spci.count);
        }
      }
    }
    // console.log(this);
    this.saveLocal();
    this.reportMats.emit({ name: this.char.name, mat: m });
  }
  checkFix(val: number, min: number, max: number) {
    // console.log(val, min, max);
    if (val === null || val < min) { return min; }
    if (val > max) { return max; }
    return val;
  }
  onInputChange() {
    const maxEvolve = this.char.evolveCosts.length - 1;
    this.data.te = this.checkFix(this.data.te, 0, maxEvolve);
    this.data.ce = this.checkFix(this.data.ce, 0, maxEvolve);

    const maxSkill = this.char.askillCosts.length + 1;
    this.data.ts = this.checkFix(this.data.ts, 1, maxSkill);
    this.data.cs = this.checkFix(this.data.cs, 1, maxSkill);

    for (const idx of this.data.specials) {
      const maxSpecial = this.char.sskillCosts[idx].levelUpCost.length;
      this.data.tss[idx] = this.checkFix(this.data.tss[idx], 0, maxSpecial);
      this.data.css[idx] = this.checkFix(this.data.css[idx], 0, maxSpecial);
    }
    this.calc();
  }
}
