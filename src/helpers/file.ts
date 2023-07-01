export namespace IMAGE_FILE {
  export const MIME_TYPE = 'image/png';

  export const PHOTO_DIMENSIONS = {
    WIDTH: 1024,
    HEIGHT: 1024,
  };

  export const COVER_DIMENSIONS = {
    WIDTH: 1280,
    HEIGHT: 720,
  };
}

export namespace FileHelper {
  export type DimensionsType = { width: number; height: number };

  export function resizeImage(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
  ) {
    // Calculate the aspect ratio of the original image
    const aspectRatio = width / height;

    // Check if resizing is required
    if (width <= maxWidth && height <= maxHeight) {
      // Image dimensions are already within the desired limits
      return { width, height };
    }

    // Calculate the new dimensions while maintaining the aspect ratio
    if (width > height) {
      // Landscape image
      width = Math.min(maxWidth, width);
      height = Math.round(width / aspectRatio);
    } else {
      // Portrait or square image
      height = Math.min(maxHeight, height);
      width = Math.round(height * aspectRatio);
    }

    return { width, height };
  }

  export interface IConvertCanvasToFileOptions {
    dimensions?: DimensionsType;
    mimeType: string;
  }

  export async function convertCanvasToFile(
    canvas: HTMLCanvasElement,
    options: IConvertCanvasToFileOptions,
  ) {
    const {
      dimensions = { width: canvas.width, height: canvas.height },
      mimeType,
    } = options;

    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = dimensions.width;
    clonedCanvas.height = dimensions.height;

    const context = clonedCanvas.getContext('2d')!;
    context.drawImage(canvas, 0, 0, dimensions.width, dimensions.height);

    const blob = await new Promise<Blob>((resolve) =>
      clonedCanvas!.toBlob((blob) => resolve(blob!), mimeType),
    );

    return new File([blob], 'image.jpg', { type: mimeType });
  }
}
