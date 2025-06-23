import { Component, OnInit } from '@angular/core';
import { ComponentProps, MouseEvent } from 'react';
import { RxjsBridgeService } from 'src/react-app/rxjs-bridge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'react-in-angular';
  showReactComponent = false;
  FancyBox = () => import('ui-lib-react').then((m) => m.FancyBox);
  BlinkBlink = () => import('ui-lib-react').then((m) => m.BlinkBlink);
  AnotherBox = () => import('ui-lib-react').then((m) => m.FancyBox);
  Pikachu = () => import('ui-lib-react').then((m) => m.Pikachu);
  counter = 0;
  handleClickBlinkFromAngular = (e: MouseEvent) => {
    this.counter++;
    // Workaround: reassign to new object ref to let Angular know about the change
    // This is necessary because the BlinkBlink component is a React component and it needs immutable props to display correctly
    // this.blinkProps = {
    //   ...this.blinkProps,
    //   counter: this.counter,
    // };

    this.rxjsBridge.sendMessage({
      type: 'event.click',
      payload: {
        component: 'BlinkBlink',
        counter: this.counter,
      },
    });
  };
  // blinkProps: ComponentProps<typeof import('ui-lib-react').BlinkBlink> = {
  //   counter: this.counter,
  //   onClick: this.handleClickBlinkFromAngular,
  // };
  pikachuSrc: PikachuProps['src'] = undefined;

  rxSubject = this.rxjsBridge.getSubject();

  constructor(private rxjsBridge: RxjsBridgeService) {}

  ngOnInit() {
    this.rxSubject = this.rxjsBridge.getSubject();
    this.rxSubject.subscribe((msg: any) => {
      console.log('Angular received:', msg);
    });
  }

  sendToReact1 = () =>
    this.rxjsBridge.sendMessage({
      type: 'key bitch, take this',
      payload: {
        eventName: 'anything you want',
        canBeAnyDataType: new Date(),
        orNothing: null,
      },
    });

  sendToReact2 = () =>
    this.rxjsBridge.sendMessage({
      type: 'hey dude, take this',
      payload: [1, 2, 3, 4, 5],
    });

  sendFromReact1 = (payload: any) =>
    this.rxjsBridge.sendMessage({
      type: 'event.click',
      payload,
    });

  sendFromReact2 = (payload: any) =>
    this.rxjsBridge.sendMessage({
      type: 'event.click',
      payload,
    });

  handleClickTogglePikachuSrc = () => {
    // toggle between this and undefined:
    this.pikachuSrc = this.pikachuSrc
      ? undefined
      : 'https://i0.wp.com/lordlibidan.com/wp-content/uploads/2019/03/Running-Pikachu-GIF.gif';
  };
}

type PikachuProps = ComponentProps<typeof import('ui-lib-react').Pikachu>;
