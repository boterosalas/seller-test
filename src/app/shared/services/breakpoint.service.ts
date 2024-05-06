import { Injectable } from '@angular/core';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BreakpointService {
    private breakpoint = new BehaviorSubject<Window>(window);

    constructor() {
        fromEvent<Event>(window, 'resize').subscribe((res) => {
            this.onResize(res as UIEvent);
        });
    }

    get breakpoint$(): Observable<Window> {
        return this.breakpoint.asObservable();
    }

    private onResize(event: UIEvent) {
        this.breakpoint.next(<Window>event.target);
    }

    isWidthLessThanBreakpoint(breakpoint: string) {
        return this.breakpoint$.pipe(
            map((res: any) => res.innerWidth < breakpoint)
        );
    }
}
