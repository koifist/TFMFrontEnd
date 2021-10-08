import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AssetsService } from 'src/app/services/assets.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-creation-modal',
  templateUrl: './asset-creation-modal.component.html',
  styleUrls: ['./asset-creation-modal.component.scss'],
})
export class AssetCreationModalComponent implements OnInit {
  public assetForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    assetType: new FormControl('', Validators.required),
    criticality: new FormControl('', Validators.required),
    mtd: new FormControl('', Validators.required),
    rto: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  public assetTypes = this.data.assetTypes;
  public criticality = environment.criticality;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assetService: AssetsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<AssetCreationModalComponent >
  ) {}

  ngOnInit(): void {
    if (this.data?.asset) {
      this.assetForm.get('id')?.setValue(this.data?.asset?.id);
      this.assetForm.get('name')?.setValue(this.data?.asset?.name);
      this.assetForm
        .get('assetType')
        ?.setValue(this.data?.asset?.assetType?.id);
      this.assetForm
        .get('criticality')
        ?.setValue(this.data?.asset?.criticality);
      this.assetForm.get('mtd')?.setValue(this.data?.asset?.mtd);
      this.assetForm.get('rto')?.setValue(this.data?.asset?.rto);
      this.assetForm
        .get('description')
        ?.setValue(this.data?.asset?.description);
    }
  }
  saveAsset() {
    if (this.assetForm.valid) {
      const asset = this.assetForm.getRawValue();
      if (asset.mtd > asset.rto) {
        if (asset?.id) {
          this.assetService
            .updateAsset(asset.id, asset)
            .pipe(first())
            .subscribe(
              (res: any) => {
                this.toastr.success(
                  this.translate.instant('toastr.assetEditionSuccess')
                );
                this.dialogRef.close(true);
              },
              (err: { status: number }) => {
                this.toastr.error(this.translate.instant('toastr.serverError'));
              }
            );
        } else {
          this.assetService
            .createAsset(asset)
            .pipe(first())
            .subscribe(
              (res: any) => {
                this.toastr.success(
                  this.translate.instant('toastr.assetCreationSuccess')
                );
                this.dialogRef.close(true);
              },
              (err: { status: number }) => {
                this.toastr.error(this.translate.instant('toastr.serverError'));
              }
            );
        }
      } else {
        this.toastr.error(this.translate.instant('toastr.mtdRtoError'));
      }
    } else {
      this.toastr.error(this.translate.instant('toastr.requiredFields'));
    }
  }
}
