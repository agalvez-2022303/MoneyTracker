import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div class="scanlines"></div>
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  `,
})
export class CursorComponent implements OnInit, OnDestroy {
  private dotEl: HTMLElement | null = null;
  private ringEl: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.dotEl = this.el.nativeElement.querySelector('.cursor-dot');
    this.ringEl = this.el.nativeElement.querySelector('.cursor-ring');
  }

  ngOnDestroy(): void {}

  private mover(el: HTMLElement, x: number, y: number): void {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dotEl) this.mover(this.dotEl, event.clientX, event.clientY);
    if (this.ringEl) this.mover(this.ringEl, event.clientX, event.clientY);
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const interactivo = !!target.closest('a, button, input, [data-cursor]');
    if (this.ringEl) this.ringEl.classList.toggle('activo', interactivo);
  }
}