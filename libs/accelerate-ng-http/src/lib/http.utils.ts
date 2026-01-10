// external imports

// internal imports
import { DownloadResponse } from './http.types';

// global variables

/**
 * Class providing http utility functions
 */
export class HttpUtil {
  /**
   * Trims redundant slashes from a URL.
   *
   * This function takes a URL string as input and removes any redundant slashes,
   * ensuring that there is only one slash between each segment of the URL.
   *
   * @param url - The URL string to be trimmed.
   * @returns The trimmed URL string with redundant slashes removed.
   */
  public static trimURL(url: string): string {
    return url.replace(/([^:]\/)\/+/g, '$1');
  }

  /**
   * This method helps download a file sent by the server in base64 format. It decodes the data to Blob and triggers a download.
   *
   * @param {DownloadResponse} response - The response object containing the file data, content type, and file name.
   */
  public static downloadFile(response: DownloadResponse): void {
    const byteCharacters = atob(response.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.contentType });

    const downloadURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadURL;
    a.download = response.fileName;
    a.onclick = () => {
      setTimeout(() => {
        URL.revokeObjectURL(downloadURL);
      }, 100);
    };
    a.click();
  }
}
