import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy } from "@angular/core";
import { FileService } from "src/app/services/file.service";

@Directive({
	selector: '[backdrop]',
	standalone: true
})
export class BackdropDirective implements OnInit, OnDestroy {
	@Input('backdrop') source = '';

	private backdropElement: HTMLElement | null = null;

	constructor(private el: ElementRef, private renderer: Renderer2, private _fs: FileService) {}

	ngOnInit(): void {
		this.source = this._fs.profileBackground(this.source);

		this.createBackdrop();
	}

	ngOnDestroy(): void {
		if (this.backdropElement) {
			this.renderer.removeChild(this.el.nativeElement, this.backdropElement);
		}
	}

	private createBackdrop(): void {
		const host = this.el.nativeElement;

		this.renderer.setStyle(host, 'position', 'relative');

		this.renderer.setStyle(host, 'overflow', 'hidden');

		this.renderer.setStyle(host, 'z-index', 0);

		const isVideo = /\.(mp4|webm|ogg)$/i.test(this.source);

		if (isVideo) {
			const video = this.renderer.createElement('video');

			const source = this.renderer.createElement('source');

			this.renderer.setAttribute(source, 'src', this.source);

			this.renderer.setAttribute(source, 'type', 'video/webm');

			this.renderer.appendChild(video, source);

			this.renderer.setAttribute(video, 'autoplay', 'autoplay');

			// this.renderer.setAttribute(video, 'muted', 'true');

			this.renderer.setProperty(video, 'muted', true);

			this.renderer.setAttribute(video, 'loop', 'true');

			this.renderer.setAttribute(video, 'playsinline', '');

			this.renderer.setStyle(video, 'object-fit', 'cover');

			this.styleBackdropElement(video);

			this.backdropElement = video;
		} else {
			const img = this.renderer.createElement('img');

			this.renderer.setAttribute(img, 'src', this.source);

			this.renderer.setStyle(img, 'object-fit', 'cover');

			this.styleBackdropElement(img);

			this.backdropElement = img;
		}

		this.renderer.appendChild(host, this.backdropElement);
	}

	private styleBackdropElement(el: HTMLElement): void {
		this.renderer.setStyle(el, 'position', 'absolute');

		this.renderer.setStyle(el, 'top', '0');

		this.renderer.setStyle(el, 'left', '0');

		this.renderer.setStyle(el, 'width', '100%');

		this.renderer.setStyle(el, 'height', '100%');

		this.renderer.setStyle(el, 'z-index', '-1');

		this.renderer.setStyle(el, 'pointer-events', 'none');
	}
}