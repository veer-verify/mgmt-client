import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AssetService } from 'src/services/asset.service';
import { ChartService } from 'src/services/chart.service';

@Component({
  selector: 'app-wifi-detail',
  templateUrl: './wifi-detail.component.html',
  styleUrls: ['./wifi-detail.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class WifiDetailComponent implements OnInit {

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    private chartService: ChartService,
    private assetSer: AssetService
  ) { }

  UserForm!: FormGroup
  deviceData: any;
  ngOnInit(): void {
    // this.deviceData = this.show;
    // console.log(this.deviceData)
    this.wifiDeatils();
    this.dayWiseStats()
  }

  newDayWiseData: any = [];
  dayWiseStatsData: any;
  response: any;
  dayWiseStats() {
    this.assetSer.dayWiseStats().subscribe((res: any) => {
      // console.log(res);
      this.response = res;
      this.dayWiseStatsData = res.content;
      this.newDayWiseData = this.dayWiseStatsData;
      
    })
  }

graphData:any = [];
keys: any = [];
values: any = [];
wifiDeatils() {
  this.assetSer.getAnalytics(this.show).subscribe((res:any) => {
    // console.log(res);
    this.graphData.push({data: res.day, type: 'Day'});
    this.graphData.push({data: res.week, type: 'Week'});
    this.graphData.push({data: res.month, type: 'Month'});
    this.graphData.push({data: res.quarter, type: 'Quarter'});
    console.log(this.graphData  )

    // this.mychart(res.dayWise, 'chart01', 1);
    // this.mychart(res.weekWise, 'chart02', 1);
    // this.mychart(res.monthWise, 'chart03', 1);
    // this.mychart(res.quarterWise, 'chart04', 1);
    this.mychart(res.day, 'chart1', 'Day', 0);
    this.mychart(res.week, 'chart2', 'Week', 0);
    this.mychart(res.month, 'chart3', 'Month', 0);
    this.mychart(res.quarter, 'chart4', 'Quarter', 0);
  })
}


  mychart(payload: any, type: any, tit: any, flag: any) {
    // console.log(payload);
    let counts: any;
    let newTitle: any;
    if(flag === 0) {
      counts = payload.counts.split(',');
      newTitle = tit;
    } else {
      counts = payload.times.split(',');
      newTitle = tit + ', ' + 'Time'
    }
    let labels = payload.labels.split(',');
    labels.reverse()
    let timestrings = payload.timestrings.split(',');
    var chartType = 'line';
    var title = newTitle;
    var categories = labels;
    var elementid = type;
    var subTitle = tit;
    let arr: any = [];
    labels.forEach((item: any, index: any) => {
    if(flag == 0 ) {
      arr.push([labels[index] + ', ' + counts[index] + ', ' + timestrings[index], Number(counts[index])]);
    } else {
      arr.push(counts[index] + ', ' + [timestrings[index], Number(counts[index])]);
    }
    })
    var data = arr;
    data.reverse();
    this.chartService.wifiChart(chartType, title, data, elementid, subTitle, categories)
  }

  close() {
    this.newItemEvent.emit();
  }

}
