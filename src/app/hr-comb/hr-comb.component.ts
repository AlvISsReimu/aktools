import { Component, OnInit, Input } from '@angular/core';
import { HrComb } from '../model/hrcomb';

@Component({
  selector: 'app-hr-comb',
  templateUrl: './hr-comb.component.html',
  styleUrls: ['./hr-comb.component.scss']
})
export class HrCombComponent implements OnInit {
  @Input() hrcombs: Array<HrComb>;
  constructor() { }

  // Note: without this trackBy function, *ngFor re-rendering will be extremely
  // slow due to the tracking mechanism.
  public trackComb(_: number, item: HrComb) {
    if (item === null) { return null; }
    return item.id;
  }

  ngOnInit() {
  }

}
