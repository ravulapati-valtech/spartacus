import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TrapFocusDirective } from './trap-focus.directive';
import { TrapFocusService } from './trap-focus.service';

@Component({
  selector: 'cx-host',
  template: `
    <div cxTrapFocus id="a"></div>
    <div [cxTrapFocus]="{ trap: true }" id="b"></div>
    <div [cxTrapFocus]="{ trap: false }" id="c"></div>
  `,
})
class MockComponent {}

class MockTrapFocusService {
  hasFocusableChilds() {
    return true;
  }
  moveFocus() {}
  shouldFocus() {}
}

describe('TrapFocusDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let service: TrapFocusService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, TrapFocusDirective],
      providers: [
        {
          provide: TrapFocusService,
          useClass: MockTrapFocusService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    service = TestBed.inject(TrapFocusService);
  }));

  const event = {
    preventDefault: () => {},
    stopPropagation: () => {},
  };

  describe('configuration', () => {
    it('should use trap=true by default', () => {
      const host = fixture.debugElement.query(By.css('#a'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(4);
    });

    it('should move when trap = true', () => {
      const host = fixture.debugElement.query(By.css('#b'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(4);
    });

    it('should not move when trap = false', () => {
      const host = fixture.debugElement.query(By.css('#c'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(0);
    });

    it('should not move when there are not focusable childs', () => {
      spyOn(service, 'hasFocusableChilds').and.returnValue(false);
      const host = fixture.debugElement.query(By.css('#b'));
      spyOn(service, 'moveFocus').and.callThrough();
      fixture.detectChanges();

      host.triggerEventHandler('keydown.arrowup', event);
      host.triggerEventHandler('keydown.arrowdown', event);
      host.triggerEventHandler('keydown.tab', event);
      host.triggerEventHandler('keydown.shift.tab', event);
      expect(service.moveFocus).toHaveBeenCalledTimes(0);
    });
  });
});
