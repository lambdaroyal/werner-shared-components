import { createEffect, createSignal, onMount, Show } from "solid-js";
import "./Camera.scss";
import { I18nTag } from "./I18nTag";
import { longRunningBusyIndicator } from "./LongRunningBusyIndicator";
export const Camera = (props) => {
    const [frontOrBack, setFrontOrBack] = createSignal(false);
    const toggleFrontOrBack = () => setFrontOrBack((v) => !v);
    const { state, Component, onStart, onStop } = longRunningBusyIndicator({ timeOut: 1 });
    // vars for referencing the canvas and 2dCanvas context
    const [canvas, setCanvas] = createSignal();
    const [videoNode, setVideoNode] = createSignal();
    let ctx;
    createEffect(() => {
        if (canvas())
            ctx = canvas().getContext("2d");
    });
    const onClick = function () {
        onStart();
        canvas().width = videoNode().videoWidth;
        canvas().height = videoNode().videoHeight;
        ctx.drawImage(videoNode(), 0, 0);
        const base64 = canvas().toDataURL("image/png");
        onStop();
        debugger;
        props.onSubmit(base64);
    };
    onMount(() => {
        function handleSuccess(stream) {
            videoNode().srcObject = stream;
        }
        function handleError(msg) {
            props.hideCamera();
            props.onError(msg);
        }
        const constraints = {
            video: { facingMode: frontOrBack() ? "user" : "environment" },
            width: { exact: window.innerWidth * 0.7 },
            height: { exact: window.innerHeight * 0.7 },
        };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(handleSuccess)
            .catch((error) => handleError(error));
    });
    return (<div class="fullscreen-modal">
      <Show when={!state.running}>
        <a class="front-back" onclick={toggleFrontOrBack}>
          <span class="glyphicons glyphicons-retweet"/>
        </a>
      </Show>
      <video autoplay class="camera-centered" webkit-playsinline="true" playsinline ref={setVideoNode}/>
      <canvas style="display: none" ref={setCanvas}/>
      <div class="flex justify-center fixed gap-2 px-8 pb-4 w-full bottom-0">
        <button class="btn btn-primary flex flex-row flex-nowrap" onclick={onClick}>
          <Component />
          <I18nTag>upload image</I18nTag>
        </button>
        <button class="btn btn-secondary" onclick={props.hideCamera}>
          Cancel
        </button>
      </div>
    </div>);
};
