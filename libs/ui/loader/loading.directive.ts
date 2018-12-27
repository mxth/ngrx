import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core'
import { first, map, tap } from 'rxjs/operators'
import { LoaderComponent } from './loader.component'

@Directive({ selector: '[uiLoading]' })
export class LoadingDirective implements OnInit, OnDestroy {
  @Input()
  set uiLoading(value: boolean) {
    this._uiLoading = value
    this.updateLoading()
  }
  get uiLoading() {
    return this._uiLoading
  }
  private _uiLoading = false

  host?: HTMLElement

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LoaderComponent,
    )
    const componentRef = this.viewRef.createComponent(componentFactory)

    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(
        first(),
        map(res =>
          res.matches ? document.body : this.viewRef.element.nativeElement,
        ),
        tap(host => {
          this.host = host
          this.renderer.appendChild(
            host,
            componentRef.instance.eRef.nativeElement,
          )
          this.updateLoading()
        }),
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.uiLoading = false
  }

  updateLoading() {
    if (!this.host) {
      return
    }
    if (this.uiLoading) {
      this.renderer.addClass(this.host, 'ui-loading')
      this.renderer.addClass(this.host, 'ui-loading-active')
    } else {
      this.renderer.removeClass(this.host, 'ui-loading')
      this.renderer.removeClass(this.host, 'ui-loading-active')
    }
  }
}
