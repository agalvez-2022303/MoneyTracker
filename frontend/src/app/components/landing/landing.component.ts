import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideTrendingUp,
  LucideWallet,
  LucideLayoutDashboard,
  LucideTarget,
  LucideTags,
  LucideShieldCheck,
  LucideGlobe,
} from '@lucide/angular';
import { ThreeDShapesComponent } from '../three-d-shapes/three-d-shapes.component';
import { RevealDirective } from '../../directives/reveal.directive';

interface Contador {
  etiqueta: string;
  sufijo: string;
  decimales: number;
  valor: number;
  actual: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RevealDirective,
    ThreeDShapesComponent,
    LucideArrowRight,
    LucideTrendingUp,
    LucideWallet,
    LucideLayoutDashboard,
    LucideTarget,
    LucideTags,
    LucideShieldCheck,
    LucideGlobe,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tarjeta') tarjeta?: ElementRef<HTMLElement>;

  transacciones = [
    { nombre: 'Depósito · Nómina', monto: '+ Q4,500.00', tipo: 'in' },
    { nombre: 'Supermercado', monto: '− Q840.15', tipo: 'out' },
    { nombre: 'Meta · Vuelo CDMX', monto: '62%', tipo: 'goal' },
    { nombre: 'Interés mensual', monto: '+ Q45.20', tipo: 'in' },
  ];

  cotizaciones = [
    'BTC',
    '$67,420',
    'ETH',
    '$3,215',
    'SOL',
    '$148',
    'GTQ',
    '7.52/USD',
    'BTC',
    '$67,420',
    'ETH',
    '$3,215',
    'SOL',
    '$148',
    'GTQ',
    '7.52/USD',
  ];

  contadores: Contador[] = [
    { etiqueta: 'en activos gestionados', sufijo: 'M+', decimales: 0, valor: 18, actual: 0 },
    { etiqueta: 'usuarios activos', sufijo: 'K', decimales: 1, valor: 2.4, actual: 0 },
    { etiqueta: 'comisiones ocultas', sufijo: '%', decimales: 0, valor: 0, actual: 0 },
    { etiqueta: 'de disponibilidad', sufijo: '/7', decimales: 0, valor: 24, actual: 0 },
  ];

  private observerContadores?: IntersectionObserver;
  private observersReveal: IntersectionObserver[] = [];
  private rafTilt = 0;
  private tilt = { rx: 0, ry: 0, tx: 0, ty: 0 };

  ngAfterViewInit(): void {
    this.animarContadores();
    this.iniciarTilt();
  }

  ngOnDestroy(): void {
    this.observerContadores?.disconnect();
    this.observersReveal.forEach((o) => o.disconnect());
    cancelAnimationFrame(this.rafTilt);
  }

  private animarContadores(): void {
    const objetivo = document.getElementById('numeros');
    if (!objetivo) return;
    this.observerContadores = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.observerContadores?.disconnect();
        const inicio = performance.now();
        const duracion = 1400;
        const step = (ahora: number): void => {
          const p = Math.min((ahora - inicio) / duracion, 1);
          const easing = 1 - Math.pow(1 - p, 3);
          this.contadores.forEach((c) => {
            c.actual = +(c.valor * easing).toFixed(c.decimales);
          });
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.35 }
    );
    this.observerContadores.observe(objetivo);
  }

  private iniciarTilt(): void {
    const escena = document.querySelector('.hero__der') as HTMLElement;
    if (!escena || !this.tarjeta) return;
    const ele = this.tarjeta.nativeElement;

    const onMove = (e: MouseEvent): void => {
      const rect = escena.getBoundingClientRect();
      this.tilt.tx = (e.clientX - rect.left) / rect.width - 0.5;
      this.tilt.ty = (e.clientY - rect.top) / rect.height - 0.5;
    };
    escena.addEventListener('mousemove', onMove);
    const onLeave = (): void => {
      this.tilt.tx = 0;
      this.tilt.ty = 0;
    };
    escena.addEventListener('mouseleave', onLeave);

    const bucle = (): void => {
      this.tilt.rx += (this.tilt.ty * 14 - this.tilt.rx) * 0.08;
      this.tilt.ry += (this.tilt.tx * 18 - this.tilt.ry) * 0.08;
      ele.style.transform = `perspective(900px) rotateX(${-this.tilt.rx}deg) rotateY(${this.tilt.ry}deg) translateY(${-1.5}px)`;
      this.rafTilt = requestAnimationFrame(bucle);
    };
    bucle();
  }
}