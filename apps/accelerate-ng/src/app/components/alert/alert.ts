import { Component, ViewChild } from '@angular/core';
import { AlertComponent } from '@rn-accelerate-ng/bootstrap';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  @ViewChild('myAlert') alert!: AlertComponent;

  // alert
  showAlert(type: string): void {
    switch (type) {
      case 'primary':
        this.alert.show('primary', 'Primary Alert', undefined);
        break;
      case 'secondary':
        this.alert.show('secondary', 'Secondary Alert', undefined);
        break;
      case 'success':
        this.alert.success('Success Alert');
        break;
      case 'info':
        this.alert.info('Info Alert');
        break;
      case 'warning':
        this.alert.warning('Warning Alert');
        break;
      case 'error':
        this.alert.error('Error Alert');
        break;
    }
  }
}
