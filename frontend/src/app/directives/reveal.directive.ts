import { Directive, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() delay = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const native = this.el.nativeElement;
    native.classList.add('reveal');
    if (this.delay) native.style.transitionDelay = `${this.delay}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          native.classList.add('visible');
          this.observer?.unobserve(native);
        }
      },
      { threshold: 0.18 }
    );
    this.observer.observe(native);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}