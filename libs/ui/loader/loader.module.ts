import { LayoutModule } from '@angular/cdk/layout'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LoaderComponent } from './loader.component'
import { LoadingDirective } from './loading.directive'

@NgModule({
  imports: [CommonModule, MatProgressBarModule, LayoutModule],
  declarations: [LoaderComponent, LoadingDirective],
  exports: [LoaderComponent, LoadingDirective],
  entryComponents: [LoaderComponent],
})
export class UILoaderModule {}
