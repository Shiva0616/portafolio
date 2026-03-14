import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private readonly platformId = inject(PLATFORM_ID);

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

    const formValue = this.contactForm.getRawValue();
    const payload = {
      from_name: formValue.name ?? '',
      from_email: formValue.email ?? '',
      subject: formValue.subject ?? '',
      message: formValue.message ?? '',
      to_email: 'danysuarez0616@gmail.com',
    };

    // If EmailJS is not configured, gracefully fallback to opening the mail client.
    if (!this.hasEmailJsConfig()) {
      this.openMailClient(payload.subject, payload.message, payload.from_email);
      this.sent.set(true);
      this.contactForm.reset();
      this.sending.set(false);
      return;
    }

    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        payload,
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

  private hasEmailJsConfig(): boolean {
    const { serviceId, templateId, publicKey } = environment.emailjs;

    const values = [serviceId, templateId, publicKey].map((v) => (v ?? '').trim());
    return values.every((v) => v.length > 0 && !v.startsWith('YOUR_'));
  }

  private openMailClient(subject: string, message: string, fromEmail: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const footer = fromEmail ? `\n\n---\nContacto: ${fromEmail}` : '';
    const mailto = `mailto:danysuarez0616@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}${footer}`)}`;
    window.location.href = mailto;
  }
}
