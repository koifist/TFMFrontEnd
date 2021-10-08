import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { IncidentsService } from '../services/incidents.service';
import { UserService } from '../services/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.scss'],
})
export class IncidentDetailComponent implements OnInit {
  public incidentForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    asset: new FormControl('', Validators.required),
    confidentiality: new FormControl(false),
    integrity: new FormControl(false),
    availability: new FormControl(false),
    techniques: new FormControl([]),
    description: new FormControl(''),
  });
  public loadingMatrix = true;
  public asset: any;
  public matrix: any;
  public techniques: any;
  public disabled = false;
  public tabIndex = 0;
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private incidentService: IncidentsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.techniques = [];
    this.getMatrix();
    this.route.queryParams
      .subscribe(params => {
        if(params.asset){
          const assetJson = JSON.parse(params.asset);
          this.incidentForm.get('asset')?.setValue(assetJson.id);
          this.asset = assetJson;
        } else if(params.incident) {
          const incidentJson = JSON.parse(params.incident);
          this.incidentForm.get('id')?.setValue(incidentJson.id);
          this.incidentForm.get('name')?.setValue(incidentJson.name);
          this.incidentForm.get('asset')?.setValue(incidentJson.asset.id);
          this.incidentForm.get('confidentiality')?.setValue(incidentJson.confidentiality);
          this.incidentForm.get('integrity')?.setValue(incidentJson.integrity);
          this.incidentForm.get('availability')?.setValue(incidentJson.availability);
          this.techniques = _.map(incidentJson.techniques, 'id');
          this.incidentForm.get('techniques')?.setValue(this.techniques);
          this.incidentForm.get('description')?.setValue(incidentJson.description);
          this.asset = incidentJson.asset;
        } else {
          this.userService.logOut();
        }
        if(params.disabled){
          this.disabled = true;
        }
      }
    );
  }
  back() {
    this.router.navigate(['/incidents']);
  }
  changetab(index: number) {
    this.tabIndex = index;
  }
  isTechniqueSelected(id: string){
    return this.techniques.includes(id);
  }
  selectTechnique(id:string){
    if(!this.disabled){
      if(this.isTechniqueSelected(id)){
        this.techniques = _.pull(this.techniques, id)
      } else {
        this.techniques.push(id);
      }

    }
  }
  getMatrix() {
    this.loadingMatrix = true;
    this.incidentService
      .getMatrix()
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.matrix = res;
          this.loadingMatrix = false;
        },
        (err: { status: number }) => {
          this.toastr.error(this.translate.instant('toastr.serverError'));
        }
      );
  }
  saveIncident() {
    this.incidentForm.get('techniques')?.setValue(this.techniques);
    if (this.incidentForm.valid) {
      const incident = this.incidentForm.getRawValue();
      if (incident?.id) {
        this.incidentService
          .updateIncident(incident.id, incident)
          .pipe(first())
          .subscribe(
            (res: any) => {
              this.toastr.success(
                this.translate.instant('toastr.incidentEditionSuccess')
              );
              this.back();
            },
            (err: { status: number }) => {
              this.toastr.error(this.translate.instant('toastr.serverError'));
            }
          );
      } else {
        this.incidentService
          .createIncident(incident)
          .pipe(first())
          .subscribe(
            (res: any) => {
              this.toastr.success(
                this.translate.instant('toastr.incidentCreationSuccess')
              );
              this.back();
            },
            (err: { status: number }) => {
              this.toastr.error(this.translate.instant('toastr.serverError'));
            }
          );
      }
    } else {
      this.toastr.error(this.translate.instant('toastr.requiredFields'));
      this.changetab(0);
    }
  }
}
