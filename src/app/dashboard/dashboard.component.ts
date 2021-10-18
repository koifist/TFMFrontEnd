import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AssetsService } from '../services/assets.service';
import { DashboardService } from '../services/dashboard.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {
  Color,
  Label,
  PluginServiceGlobalRegistrationAndOptions,
} from 'ng2-charts';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public incMonthData: ChartDataSets[] = [];
  public incMonthLabels: Label[] = [];
  public incMonthOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black' },
          gridLines: { color: 'transparent' },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: 'black',
            maxTicksLimit: 8,
            beginAtZero: true,
            precision: 0,
          },
          gridLines: { color: 'black' },
        },
      ],
    },
    plugins: {
      datalabels: {
        display: false,
        anchor: 'start',
        align: 'top',
        rotation: 320,
        clamp: true,
        font: {
          weight: 'bold',
          size: 13,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 30,
        bottom: 20,
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
  };
  public incAssetOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx?.chart?.data?.labels
            ? ctx.chart.data.labels[ctx.dataIndex]
            : '';
          return label;
        },
      },
    },
  };
  public incMonthType: ChartType = 'line';
  public incAssetType: ChartType = 'pie';
  public incMonthLegend = false;
  public incAssetLegend = true;
  public incMonthColors: Color[] = [
    {
      backgroundColor: 'transparent',
      borderColor: 'rgba(0,0,128, 0.8)',
      pointBackgroundColor: 'rgba(0,0,128, 0.9)',
    },
  ];
  public incAssetColors: Color[] = [
    {
      backgroundColor: [
        'rgba(0,0,0,0.7)',
        'rgba(0,0,128,0.7)',
        'rgba(0,0,255,0.7)',
        'rgba(0,128,0,0.7)',
        'rgba(0,128,128,0.7)',
        'rgba(0,255,0,0.7)',
        'rgba(0,255,255,0.7)',
        'rgba(128,0,0,0.7)',
        'rgba(128,0,128,0.7)',
        'rgba(255,255,0,0.7)',
      ],
    },
  ];

  public incAssetData: ChartDataSets[] = [];
  public incAssetLabels: Label[] = [];

  displayedColumns: string[] = [
    'status',
    'nameIncident',
    'nameAsset',
    'assetType',
    'criticality',
    'dateInitStr',
    'mtd',
    'rto',
  ];
  dataSource = new MatTableDataSource<Object>([]);
  private paginator!: MatPaginator;
  private sort!: MatSort;
  public user: any;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    if (this.dataSource !== undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  public assetTypes = [];
  public loading = true;
  public criticality = environment.criticality;
  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private assetService: AssetsService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Object>([]);
    this.getAssetsTypes();
    this.getDashboardInfo();
  }
  getDashboardInfo() {
    this.loading = true;
    this.dashboardService
      .getDashboardInfo()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.setIncMonthData(res.incidentesMonth);
          this.setIncAssetData(res.incidentsAssetType);
          this.setAssets(res.assetsDisabled);
          this.loading = false;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  getAssetsTypes() {
    this.assetService
      .getAssetTypes()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.assetTypes = res;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  setAssets(incidents: any) {
    const assetFormated = this.formatAssets(incidents);
    this.dataSource = new MatTableDataSource<Object>(assetFormated);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      switch (property) {
        case 'status':
          if (item.mtdExceeded) {
            return 4;
          } else if (item.rtoExceeded) {
            return 3;
          } else {
            return 2;
          }
        case 'nameIncident':
          return item.name;
        case 'nameAsset':
          return item.asset.name;
        case 'assetType':
          return this.translate.instant(
            'constants.' + item.asset.assetType.name
          );
        case 'criticality':
          return item.asset.criticality;
        case 'mtd':
          return item.asset.mtd;
        case 'rto':
          return item.asset.rto;
        default:
          return item[property];
      }
    };
  }
  formatAssets(incidents: any) {
    _.forEach(incidents, (incident) => {
      const hourDiff = moment().diff(moment(incident.dateInit), 'hours');
      if (hourDiff > incident.asset.mtd) {
        incident.mtdExceeded = true;
      } else if (hourDiff > incident.asset.rto) {
        incident.rtoExceeded = true;
      }
      incident.dateInitStr = moment(incident.dateInit).format(
        'YYYY-MM-DD HH:mm'
      );
    });
    return incidents;
  }
  setIncMonthData(data: any) {
    this.incMonthData = [{ data: _.map(data, 'value'), label: this.translate.instant("constants.incidents") }];
    this.incMonthLabels = _.map(data, (elem) => {
      return moment(elem['label'])
        .locale(navigator.language.slice(0, 2))
        .format('L');
    });
  }
  setIncAssetData(data: any) {
    this.incAssetData = [{ data: _.map(data, 'value'), label: this.translate.instant("constants.incidents") }];
    this.incAssetLabels = _.map(data, (data) => {
      return this.translate.instant('constants.' + data['label']);
    });
  }
}
