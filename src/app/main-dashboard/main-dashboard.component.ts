import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartService } from 'src/services/chart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})


export class MainDashboardComponent implements OnInit {

  constructor(
    private chartservice: ChartService,
    private http: HttpClient
  ) { }


  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  ngOnInit(): void {
    this.getMainDashboardCardReport();
    this.getMainDashboardReport();
    this.mychart();
    this.mychart1();
    this.mychart2();
    this.mychart3();
    this.mychart4();
  }


  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  cardReport: any;
  getMainDashboardCardReport() {
    this.getNoOfElements();
    this.http.get('assets/JSON/verticalCard.json').subscribe(res => {
      this.cardReport = res;
      var a = JSON.parse(JSON.stringify(res));
      this.showcardReport = a.splice(0, this.noOfCards);
    });
  }

  noOfCards = 4;
  getNoOfElements() {
    var x = document.body.clientWidth;
    if (x < 400) { this.noOfCards = 1; }
    if (x > 400) { this.noOfCards = 1; }
    if (x > 500) { this.noOfCards = 2; }
    if (x > 700) { this.noOfCards = 3; }
    if (x > 900) { this.noOfCards = 4; }
    if (x > 1400) { this.noOfCards = 5; }
    // console.log(this.noOfCards)
  }

  mainReport: any;
  count: any;
  totalCust: any = 0;
  totalSites: any = 0;
  totalCams: any = 0;
  totalAna: any = 0;
  totalUsers: any = 0;
  getMainDashboardReport() {
    this.http.get('assets/JSON/mainDashboard.json').subscribe(res => {
      this.mainReport = res;
      // console.log(res)
      this.count = Object.keys(res).length;
      this.mainReport.forEach((el: any) => {
        this.totalCust += Number(el.customerCount);
        this.totalSites += Number(el.sitesCount);
        this.totalCams += Number(el.camerasCount);
        this.totalAna += Number(el.analyticsCount);
        this.totalUsers += Number(el.usersCount);
      });
    });
  }

  showmenu(event: any) {
    var x = event.target.parentNode.previousElementSibling;
  }

  mychart() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CUSTOMERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    //var antype = 'Minutes';
    var elementid = 'chart';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  mychart1() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL SITES REPORT - 7';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart1';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  mychart2() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CAMERAS REPORT - 49';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart2';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart3() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL ANALYTICS REPORT - 42';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart3';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart4() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL USERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart4';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  showcardReport: any;
  startIndex: number = 1;
  endIndex: number = 4;
  prevvert() {
    var indexOfFirstElem = this.cardReport.map((item: any) => item.id).indexOf(this.showcardReport[0].id);

    if (indexOfFirstElem != 0) {
      indexOfFirstElem -= 1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }
  }

  nextvert() {
    var indexOfFirstElem = this.cardReport.map((item: any) => item.id).indexOf(this.showcardReport[0].id);

    if ((indexOfFirstElem + this.noOfCards) < this.cardReport.length) {
      indexOfFirstElem += 1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }

    // let x = this.cardReport.slice(this.startIndex++, this.endIndex++);
    // this.showcardReport = x;
  }

}
