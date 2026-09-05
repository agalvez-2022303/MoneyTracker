import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

interface Orbital {
  mesh: THREE.Mesh;
  radius: number;
  speed: number;
  angle: number;
  self: number;
  bob: number;
  phase: number;
}

@Component({
  selector: 'app-three-d-shapes',
  standalone: true,
  template: '<div #contenedor class="shapes" aria-hidden="true"></div>',
  styles: [
    `
      :host { display: block; width: 100%; height: 100%; }
      .shapes { width: 100%; height: 100%; }
      :host ::ng-deep canvas { display: block; width: 100%; height: 100%; }
    `,
  ],
})
export class ThreeDShapesComponent implements OnInit, OnDestroy {
  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;

  private renderizador!: THREE.WebGLRenderer;
  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private reloj = new THREE.Clock();
  private orbitales: Orbital[] = [];
  private aniables: { mesh: THREE.Object3D; rx: number; ry: number; fs: number }[] = [];

  private geometrias: THREE.BufferGeometry[] = [];
  private materiales: THREE.Material[] = [];

  private anilloGrande!: THREE.Mesh;
  private animacionId = 0;
  private observer?: ResizeObserver;
  private mouse = { x: 0, y: 0 };
  private disposed = false;

  ngOnInit(): void {
    this.inicializar();
    this.animar();

    const contenedor = this.contenedor.nativeElement;
    const onMove = (e: MouseEvent): void => {
      const rect = contenedor.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      this.mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    contenedor.addEventListener('mousemove', onMove);

    this.observer = new ResizeObserver(() => {
      if (this.disposed) return;
      const ancho = contenedor.clientWidth || 320;
      const alto = contenedor.clientHeight || 320;
      this.camara.aspect = ancho / alto;
      this.camara.updateProjectionMatrix();
      this.renderizador.setSize(ancho, alto);
    });
    this.observer.observe(contenedor);
  }

  ngOnDestroy(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animacionId);
    this.observer?.disconnect();
    this.geometrias.forEach((g) => g.dispose());
    this.materiales.forEach((m) => m.dispose());
    this.renderizador.dispose();
  }

  private material(
    color: number,
    opacidad: number,
    metalness = 0.55,
    roughness = 0.25
  ): THREE.MeshStandardMaterial {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent: true,
      opacity: opacidad,
    });
    this.materiales.push(m);
    return m;
  }

  private anadirMalla(
    geometria: THREE.BufferGeometry,
    material: THREE.Material,
    pos: [number, number, number]
  ): THREE.Mesh {
    this.geometrias.push(geometria);
    const malla = new THREE.Mesh(geometria, material);
    malla.position.set(...pos);
    this.escena.add(malla);
    return malla;
  }

  private inicializar(): void {
    const contenedor = this.contenedor.nativeElement;
    const ancho = contenedor.clientWidth || 320;
    const alto = contenedor.clientHeight || 320;

    this.escena = new THREE.Scene();
    this.camara = new THREE.PerspectiveCamera(45, ancho / alto, 0.1, 100);
    this.camara.position.z = 6.4;

    this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderizador.setSize(ancho, alto);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    contenedor.appendChild(this.renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.55);
    this.escena.add(luzAmbiente);

    const luzPrincipal = new THREE.DirectionalLight(0x22c55e, 1.7);
    luzPrincipal.position.set(5, 8, 10);
    this.escena.add(luzPrincipal);

    const luzVerde = new THREE.PointLight(0x4ade80, 0.9);
    luzVerde.position.set(-5, -4, 5);
    this.escena.add(luzVerde);

    const luzLila = new THREE.PointLight(0x9945ff, 0.6);
    luzLila.position.set(0, 3, -6);
    this.escena.add(luzLila);

    const icosaedroG = new THREE.IcosahedronGeometry(1.15, 0);
    const icosaedro = this.anadirMalla(icosaedroG, this.material(0x22c55e, 0.92, 0.7, 0.22), [0, 0, 0]);
    const bordeG = new THREE.EdgesGeometry(icosaedroG);
    const bordeM = new THREE.LineBasicMaterial({ color: 0x4ade80 });
    this.geometrias.push(bordeG);
    this.materiales.push(bordeM);
    const borde = new THREE.LineSegments(bordeG, bordeM);
    icosaedro.add(borde);
    this.aniables.push({ mesh: icosaedro, rx: 0.004, ry: 0.006, fs: 0 });

    const colores = [0x4ade80, 0x9945ff, 0x16a34a, 0x22c55e];
    const definiciones: [
      THREE.BufferGeometry,
      THREE.MeshStandardMaterial,
    ][] = [
      [new THREE.SphereGeometry(0.5, 24, 24), this.material(colores[0], 0.9, 0.5, 0.2)],
      [new THREE.TorusKnotGeometry(0.42, 0.14, 72, 12), this.material(colores[1], 0.85, 0.6, 0.2)],
      [new THREE.BoxGeometry(0.5, 0.5, 0.5), this.material(colores[2], 0.85, 0.55, 0.25)],
      [new THREE.TetrahedronGeometry(0.5), this.material(colores[3], 0.6, 0.5, 0.3)],
    ];

    definiciones.forEach(([g, m], i) => {
      const orbita = this.anadirMalla(g, m, [0, 0, 0]);
      const semi = i * (Math.PI / 2);
      this.orbitales.push({
        mesh: orbita,
        radius: 2.4 + Math.random() * 0.6,
        speed: 0.28 + Math.random() * 0.22,
        angle: Math.random() * Math.PI * 2,
        self: 0.008 + Math.random() * 0.01,
        bob: 0.2 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
      this.aniables.push({ mesh: orbita, rx: 0, ry: 0.01, fs: semi });
    });

    const anilloG = new THREE.TorusGeometry(2.15, 0.035, 12, 90);
    const anilloM = this.material(0x4ade80, 0.25, 0.3, 0.4);
    this.anilloGrande = new THREE.Mesh(anilloG, anilloM);
    this.anilloGrande.rotation.x = Math.PI / 2.1;
    this.anilloGrande.rotation.y = 0.4;
    this.geometrias.push(anilloG);
    this.escena.add(this.anilloGrande);

    /* Polvo sutil */
    this.anadirMalla(new THREE.SphereGeometry(0.05, 8, 8), this.material(0x22c55e, 0.7), [-2.6, 1.6, -1]);
    this.anadirMalla(new THREE.SphereGeometry(0.04, 8, 8), this.material(0x4ade80, 0.7), [2.8, -1.2, -1.5]);
    this.anadirMalla(new THREE.SphereGeometry(0.06, 8, 8), this.material(0x9945ff, 0.7), [1.4, 2.2, -2]);
  }

  private animar = (): void => {
    if (this.disposed) return;
    this.animacionId = requestAnimationFrame(this.animar);
    const dt = Math.min(this.reloj.getDelta(), 0.033);
    const t = performance.now() * 0.001;

    this.orbitales.forEach((o) => {
      o.angle += o.speed * dt;
      o.mesh.position.x = Math.cos(o.angle) * o.radius;
      o.mesh.position.z = Math.sin(o.angle) * o.radius;
      o.mesh.position.y = Math.sin(o.phase + t * 0.9) * o.bob;
      o.mesh.rotation.x += o.self * 0.6;
      o.mesh.rotation.y += o.self;
    });

    this.aniables.forEach((a) => {
      a.mesh.rotation.x += a.rx;
      a.mesh.rotation.y += a.ry;
      a.mesh.rotation.z += a.fs * 0.002;
    });

    this.anilloGrande.rotation.z += 0.0009;
    this.anilloGrande.rotation.x = Math.PI / 2.1 + Math.sin(t * 0.2) * 0.08;

    this.escena.rotation.y += (this.mouse.x * 0.32 - this.escena.rotation.y) * 0.045;
    this.escena.rotation.x += (this.mouse.y * 0.22 - this.escena.rotation.x) * 0.045;

    this.renderizador.render(this.escena, this.camara);
  };
}