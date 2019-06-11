import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MaterialItemData } from '../model/materialitemdata';
import { MaterialInfo } from '../model/materialinfo';

@Component({
  selector: 'app-material-card',
  templateUrl: './material-card.component.html',
  styleUrls: ['./material-card.component.scss']
})
export class MaterialCardComponent implements OnInit {
  @Input() item: MaterialInfo;
  data:MaterialItemData;
  @Input()
  set itemdata(data: MaterialItemData) {
    this.data = data;
  }
  get itemdata() {
    return this.data;
  }

  @Output() dataChange = new EventEmitter<MaterialItemData>();
  @Output() reportMerge = new EventEmitter<string>();

  onInputChange(): void {
    this.dataChange.emit(this.itemdata);
  }

  doMerge(): void {
    this.reportMerge.emit(this.item.name);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
