import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SectionTitleComponent } from '@shared/components/section-title/section-title.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { environment } from '@env/environment';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SectionTitleComponent, RevealDirective, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  readonly sending = signal(false);
  readonly sent = signal(false);
  readonly error = signal(false);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly contactInfo = [
    { icon: 'email', label: 'Email', value: 'danysuarez0616@gmail.com', href: 'mailto:danysuarez0616@gmail.com' },
    { icon: 'location', label: 'Ubicación', value: 'Colombia', href: '' },
    { icon: 'status', label: 'Disponibilidad', value: 'Disponible para proyectos', href: '' },
  ];

  async sendMessage(): Promise<void> {
    if (this.contactForm.invalid || this.sending()) return;

    this.sending.set(true);
    this.error.set(false);

    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          from_name: this.contactForm.value.name,
          from_email: this.contactForm.value.email,
          subject: this.contactForm.value.subject,
          message: this.contactForm.value.message,
          to_email: 'danysuarez0616@gmail.com',
        },
        environment.emailjs.publicKey
      );
      this.sent.set(true);
      this.contactForm.reset();
    } catch {
      this.error.set(true);
    } finally {
      this.sending.set(false);
    }
  }
}
