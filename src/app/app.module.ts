import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterLink, RouterModule } from '@angular/router';
import { LazyReactComponentDirective } from 'src/react-app/lazy-react.directive';
import { ReactWrapperComponent } from 'src/react-app/react-app-wrapper/react-app-wrapper.component';
import { ReactSelectComponent } from 'src/react-app/custom-components/react-select.component';
import { RxjsBridgeService } from 'src/react-app/rxjs-bridge.service';
import { ShadowDomFancyBoxComponent } from 'src/react-app/custom-components/shadow-dom-fancybox.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink,
    // For React only:
    LazyReactComponentDirective,
    ReactWrapperComponent,
    ShadowDomFancyBoxComponent,
    ReactSelectComponent,
  ],
  providers: [RxjsBridgeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
