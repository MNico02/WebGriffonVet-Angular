import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Loader, LoaderService } from '../../core/services/loader-service';

@Component({
  selector: 'app-loader-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-icon.html',
  styleUrls: ['./loader-icon.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class LoaderIcon implements OnInit, OnDestroy {
  private _subscription!: Subscription;
  loaded = false;

  constructor(
    private _service: LoaderService,
    private _cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this._subscription = this._service.loader$.subscribe((ref: Loader) => {
      this.loaded = ref.loaded;
      this._cdr.markForCheck(); 
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}