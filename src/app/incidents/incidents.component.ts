import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AssetsService } from '../services/assets.service';
import { IncidentsService } from '../services/incidents.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  displayedColumns: string[] = [
    'status',
    'name',
    'nameAsset',
    'assetType',
    'confidentiality',
    'integrity',
    'availability',
    'actions'
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
    status: new FormControl('', []),
    name: new FormControl(''),
    nameAsset: new FormControl(''),
    assetType: new FormControl(''),
    confidentiality: new FormControl(''),
    integrity: new FormControl(''),
    availability: new FormControl(''),
  });
  public loading = true;
  public env = environment;
  public criticality = environment.criticality;
  public assetTypes = [];
  public incidents = [];
  public user: any;
  constructor(
    private toastr: ToastrService,
    private assetService: AssetsService,
    private incidentService: IncidentsService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Object>([]);
  }
  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.user = '';
    }
    this.getAssetsTypes();
    this.getIncidents();
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
  getIncidents() {
    this.loading = true;
    this.incidentService
      .getIncidents()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.incidents = res;
          this.dataSource = new MatTableDataSource<Object>(this.incidents);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (
            data: any,
            filter: string
          ): boolean => {
            const a = this.filterForm.getRawValue();
            let returnedData = true;
            if (a.name && !data.name.includes(a.name)) {
              returnedData = false;
            }
            if (a.nameAsset && !data.asset.name.includes(a.nameAsset)) {
              returnedData = false;
            }
            if (a.assetType && data.asset.assetType.id !== a.assetType) {
              returnedData = false;
            }
            if (a.status && data.dateEnd) {
              returnedData = false;
            }
            if (a.confidentiality && !data.confidentiality) {
              returnedData = false;
            }
            if (a.integrity && !data.integrity) {
              returnedData = false;
            }
            if (a.availability && !data.availability) {
              returnedData = false;
            }
            return returnedData;
          };
          (this.dataSource.filter = 'test'), (this.loading = false);
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  filter() {
    this.dataSource.filter = 'test';
  }
  editIncident(incident: object) {}
  deleteIncident(id: string) {
    this.incidentService
      .deleteIncident(id)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.toastr.success(
            this.translate.instant('toastr.deleteAssetSuccess')
          );
          this.getIncidents();
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  closeIncident(id: string) {
    this.incidentService
      .closeIncident(id)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.toastr.success(
            this.translate.instant('toastr.deleteAssetSuccess')
          );
          this.getIncidents();
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
}
