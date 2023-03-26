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

  export async function convertCanvasToFile(
    canvas: HTMLCanvasElement,
    options: {
      dimensions: DimensionsType;
      mimeType: string;
    },
  ) {
    const { dimensions, mimeType } = options;

    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = dimensions.width;
    clonedCanvas.height = dimensions.height;

    const context = clonedCanvas.getContext('2d')!;
    context.drawImage(canvas, 0, 0, dimensions.width, dimensions.height);

    const blob = await new Promise<Blob>((resolve) =>
      clonedCanvas!.toBlob((blob) => resolve(blob!), mimeType),
    );

    return new File([blob], 'image.png', { type: mimeType });
  }
}
