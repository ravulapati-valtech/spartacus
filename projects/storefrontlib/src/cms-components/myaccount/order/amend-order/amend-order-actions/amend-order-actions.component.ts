import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cx-amend-order-actions',
  templateUrl: './amend-order-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmendOrderActionsComponent {
  @Input() orderCode: string;
  @Input() form: FormGroup;
  @Input() backRoute: string;
  @Input() forwardRoute: string;

  @HostBinding('class') styles = 'row';

  constructor(private routingService: RoutingService) {}

  continue(event: any): void {
    if (this.form.valid) {
      this.routingService.go({
        cxRoute: this.forwardRoute,
        params: { code: this.orderCode },
      });
    } else {
      this.form.markAllAsTouched();
      event.stopPropagation();
    }
  }
}
