precision mediump float;

varying vec2 vTexCoord;
uniform float u_time;
uniform float u_beat;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform sampler2D ui_tex;
uniform float u_faderValues[9];

// Bundled at build time via vite-plugin-glsl; VS Code warnings are expected.
#include "./utils/math.frag"
#include "./utils/coord.frag"
#include "./utils/color.frag"
#include "./utils/midi.frag"

void main(void) {
    vec2 uv = vTexCoord;

    if(getFaderValue(1) > 0.0){
        float mosaicNum = map(getFaderValue(1), 0.0, 1.0, 500.0, 10.0);
        uv = mosaic(uv, mosaicNum, u_resolution);
    }
    if(getFaderValue(6) == 1.0){
        uv.x = abs(uv.x-0.5);
        uv.y = abs(mod(uv.y +u_time * 0.1, 2.0) - 1.0);
        
        float angle = leapNoise(u_beat, 32.0, 4.0, 4193.91, 7492.93);
        uv.y -= 0.5;
        uv *= rot(angle);
        uv.y += 0.5;
    }
    if(getFaderValue(3) > 0.0){
        float distortionAmount = map(getFaderValue(3), 0.0, 1.0, 0.0, 3.0);
        uv = distortion(uv, distortionAmount);
    }

    vec4 col = texture2D(u_tex, uv);

    if(getFaderValue(2) > 0.0){
        float rgbShiftAmount = map(getFaderValue(2), 0.0, 1.0, 0.0, 0.1);
        col.rgb = rgbShift(u_tex, uv, vec2(rgbShiftAmount, 0.0));
    }
    // if(getFaderValue(4) == 1.0){
    //     if(gray(col.rgb) > 0.0) col.rgb = vec3(1.0);
    //     else col.rgb = vec3(0.0);
    // }

    if(getFaderValue(4) == 1.0){
        col.rgb = vec3(edge(u_tex, uv, u_resolution));
    }
    if(getFaderValue(5) == 1.0){
        col.rgb = dotPattern(u_tex, uv, u_resolution, 50.0);
    }
    if(getFaderValue(8) > 0.0){
        col.rgb *= 1.0-getFaderValue(8);
    }
        

    vec4 uiCol = texture2D(ui_tex, vTexCoord);
    col = mix(col, uiCol, uiCol.a);

    gl_FragColor = col;
}