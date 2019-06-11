import { Component, OnInit, Input } from '@angular/core';
import { MaterialItem } from '../model/materialitem';
import { FetchService } from '../fetch.service';
import { Router } from '@angular/router';
import { MdcSnackbarService } from '@blox/material';


@Component({
  selector: 'app-char-mat-matcard',
  templateUrl: './char-mat-matcard.component.html',
  styleUrls: ['./char-mat-matcard.component.scss']
})
export class CharMatMatcardComponent implements OnInit {
  @Input() allmats: { [key: string]: MaterialItem };
  private innerSMats = [];
  @Input()
  set smats(sm: Array<any>) {
    this.innerSMats = sm;
  }
  get smats() {
    return this.innerSMats;
  }
  toMaterialCalc() {
    if (!this.innerSMats || this.innerSMats.length === 0) {
      this.snackbar.show({
        message: '材料为空，请先输入需求。',
        actionText: '好的',
        multiline: false,
        actionOnBottom: false
      });
      return;
    }
    const data = this.fetch.getLocalStorage('m-data', {});
    if (Object.keys(data).length === 0) {
      this.snackbar.show({
        message: '请先打开一次材料计算页面。',
        actionText: '好的',
        multiline: false,
        actionOnBottom: false
      });
      return;
    }
    for (const m of this.innerSMats) {
      data[this.allmats[m.id].name].need = m.count;
    }
    this.fetch.setLocalStorage('m-data', data);
    this.fetch.setLocalStorage('m-option', {
      showOnly3plus: true,
      filtered: true,
      showMat: true,
      showChip: true,
      showBook: true
    });
    this.router.navigateByUrl('/material');
  }
  constructor(private fetch: FetchService, private router: Router, private snackbar: MdcSnackbarService) { }

  ngOnInit() {
  }

}
