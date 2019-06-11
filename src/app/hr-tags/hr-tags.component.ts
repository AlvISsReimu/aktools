import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HrTagRow } from '../model/hrtagrow';
import { MdcSnackbarService } from '@blox/material';

@Component({
  selector: 'app-hr-tags',
  templateUrl: './hr-tags.component.html',
  styleUrls: ['./hr-tags.component.scss']
})
export class HrTagsComponent implements OnInit {

  @Input() tagrows: Array<HrTagRow>;
  selectedTags: Array<string>;
  @Output() reportSelectedTags = new EventEmitter();
  @Output() reportSelectedStars = new EventEmitter();
  selectedStars: Array<boolean> = [true, true, true, true, true, true, true];

  onStarBtnClick(id): void {
    if (id === 0) {
      const newStat = !this.selectedStars[0];
      for (let i = 0; i < 7; i++) {
        this.selectedStars[i] = newStat;
      }
    } else {
      this.selectedStars[id] = !this.selectedStars[id];
      let allSelected = true;
      for (let i = 1; i < 7; i++) {
        if (!this.selectedStars[i]) { allSelected = false; }
      }
      this.selectedStars[0] = allSelected;
    }
    const stars = [];
    for (let i = 1; i < 7; i++) {
      if (this.selectedStars[i]) { stars.push(i); }
    }
    this.reportSelectedStars.emit(stars);
  }
  onTagClick(tag: string): void {
    const index = this.selectedTags.indexOf(tag, 0);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else if (this.selectedTags.length > 5) {
      this.showSnackBar('无法选择更多标签：最多6个', '好的');
      return;
    } else {
      this.selectedTags.push(tag);
    }
    this.reportSelectedTags.emit(this.selectedTags);
  }
  clearTags() {
    this.selectedTags = [];
    this.reportSelectedTags.emit(this.selectedTags);
  }
  showSnackBar(msg: string, action: string) {
    this.snackbar.show({
      message: msg,
      actionText: action,
      multiline: false,
      actionOnBottom: false
    });
  }
  constructor(private snackbar: MdcSnackbarService) { }
  ngOnInit() {
    this.selectedTags = [];
  }

}
