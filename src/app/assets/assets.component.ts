import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AssetsService } from '../services/assets.service';
import * as _ from 'lodash';
import { IncidentsService } from '../services/incidents.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  displayedColumns: string[] = [
    'status',
    'name',
    'assetType',
    'criticality',
    'mtd',
    'rto',
    'actions',
  ];
  dataSource = new MatTableDataSource<Object>([]);
  private paginator!: MatPaginator;
  private sort!: MatSort;
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
  public filterForm = new FormGroup({
    name: new FormControl('', []),
    assetType: new FormControl(''),
    criticality: new FormControl(''),
    status: new FormControl(''),
  });
  public loading = true;
  public env = environment;
  public criticality = environment.criticality;
  public assetTypes = [];
  public assets = [];
  constructor(
    private toastr: ToastrService,
    private assetService: AssetsService,
    private incidentService: IncidentsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<Object>([]);
  }
  ngOnInit(): void {
    this.getAssetsTypes();
    this.getAssets();
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
  getAssets() {
    this.loading = true;
    this.assetService
      .getAssets()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.assets = res;
          this.dataSource = new MatTableDataSource<Object>(this.assets);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (
            data: any,
            filter: string
          ): boolean => {
            const a = this.filterForm.getRawValue();
            let returnedData = true;
            if (a.name && data.name && !data.name.includes(a.name)) {
              returnedData = false;
            }
            if (a.assetType && data.assetType.id !== a.assetType) {
              returnedData = false;
            }
            if (a.criticality && data.criticality !== a.criticality) {
              returnedData = false;
            }
            if (a.status && data.status) {
              returnedData = false;
            }
            return returnedData;
          };
          this.dataSource.filter = "test",
          this.loading = false;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  inicialiceTable() {}
  filter() {
    this.dataSource.filter = 'test';
  }
  createAsset() {}
  editAsset(id: string) {}
  deleteAsset(id: string) {
    this.checkIncident(id)
      .then((incident: any) => {
        if (incident && incident?.id) {
          this.toastr.info(
            this.translate.instant('toastr.deleteAssetErrpr') + incident?.name
          );
        } else {
          this.assetService
            .deleteAsset(id)
            .pipe(first())
            .subscribe(
              (res: any) => {
                this.toastr.success(
                  this.translate.instant('toastr.deleteAssetSuccess')
                );
                this.getAssets();
              },
              (err: { status: number }) => {
                this.toastr.error(this.translate.instant('toastr.serverError'));
              }
            );
        }
      })
      .catch((err) => {
        this.toastr.error(this.translate.instant('toastr.serverError'));
      });
  }
  createIncident(id: string) {}
  checkIncident(id: string) {
    return new Promise((resolve, reject) => {
      this.incidentService
        .getIncidentOpen(id)
        .pipe(first())
        .subscribe(
          (res: any) => {
              resolve(res);
          },
          (err: { status: number }) => {
            reject();
          }
        );
    });
  }
}
