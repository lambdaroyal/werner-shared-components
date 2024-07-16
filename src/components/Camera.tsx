import { createEffect, createSignal, onMount, Show } from "solid-js";

import "./Camera.scss";
import { I18nTag } from "./I18nTag";

import { GuardedActivity } from "./GuardedActivity";
import { SSRHelper } from "../lib/ssrHelper";

export interface CameraProps {
  hideCamera: () => void;
  onSubmit: (base64: string) => Promise<any>;
  onError: (e: Error) => void
}

export const Camera = (props: CameraProps) => {

  const [frontOrBack, setFrontOrBack] = createSignal(false);
  const toggleFrontOrBack = () => setFrontOrBack((v) => !v);


  // vars for referencing the canvas and 2dCanvas context
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();
  const [videoNode, setVideoNode] = createSignal<HTMLVideoElement>();
  let ctx: CanvasRenderingContext2D;
  createEffect(() => {
    if (canvas()) ctx = canvas()!.getContext("2d")!;
  });


  const onClick = function () {
    canvas()!.width = videoNode()!.videoWidth;
    canvas()!.height = videoNode()!.videoHeight;
    ctx.drawImage(videoNode()!, 0, 0);
    const base64 = canvas()!.toDataURL("image/png");
    return props.onSubmit(base64);
  };

  onMount(() => {
    function handleSuccess(stream: MediaStream) {
      videoNode()!.srcObject = stream;
    }

    function handleError(msg: Error) {
      props.hideCamera();
      props.onError(msg);
    }
    const constraints = {
      video: { facingMode: frontOrBack() ? "user" : "environment" },
      width: { exact: SSRHelper.getSingleton().window?.innerWidth * 0.7 },
      height: { exact: SSRHelper.getSingleton().window?.innerHeight * 0.7 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch((error) => handleError(error));
  });

  return (
    <div class="vlicCamera fullscreen-modal">
      <a class="front-back" onclick={toggleFrontOrBack}>
        <span class="glyphicons glyphicons-retweet" />
      </a>
      <video autoplay class="camera-centered" webkit-playsinline="true" playsinline ref={setVideoNode} />
      <canvas style="display: none" ref={setCanvas} />
      <div class="flex justify-center fixed gap-2 px-8 pb-4 w-full bottom-0">
        <GuardedActivity worker={() => onClick()} class="btn btn-primary">
          <I18nTag>upload image</I18nTag>
        </GuardedActivity>
        <button class="btn btn-secondary" onclick={props.hideCamera}>
          <I18nTag>Cancel</I18nTag>
        </button>
      </div>
    </div>
  );
};
