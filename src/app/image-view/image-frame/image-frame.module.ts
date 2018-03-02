import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImageFrameComponent } from './image-frame/image-frame.component';
import { ImageFrameSizesComponent } from './image-frame-sizes/image-frame-sizes.component';
import { ImageWithOverlayComponent } from './image-with-overlay/image-with-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ImageFrameComponent, ImageFrameSizesComponent, ImageWithOverlayComponent],
  exports: [ImageFrameComponent, ImageFrameSizesComponent, ImageWithOverlayComponent]
})
export class ImageFrameModule { }
