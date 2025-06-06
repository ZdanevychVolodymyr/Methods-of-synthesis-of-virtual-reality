function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.count = 0;
    this.type = gl.TRIANGLES;

    // Upload vertex and index data to GPU
    this.BufferData = function(vertices, indices) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        if (indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STREAM_DRAW);
            this.count = indices.length;
        } else {
            this.count = vertices.length / 3;
        }
    };

    // Draw filled triangles
    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        if (this.type === gl.TRIANGLES && this.iIndexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            gl.drawElements(this.type, this.count, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(this.type, 0, this.count);
        }
    };

    // Draw wireframe mesh
    this.DrawWireframe = function() {
        if (this.iIndexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
            for (let p = 0; p < this.count; p += 3) {
                gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, p * 2);
            }
        }
    };

    // Generate parabolic double-cone-like surface
    this.CreateParabolicShape = function(H, P, uSteps, vSteps) {
        let vertices = [];
        let indices = [];

        const uMin = 0.0;
        const uMax = 2 * Math.PI;
        const vMin = -H;
        const vMax = H;

        const du = (uMax - uMin) / uSteps;
        const dv = (vMax - vMin) / vSteps;

        for (let i = 0; i <= uSteps; i++) {
            const u = uMin + i * du;
            for (let j = 0; j <= vSteps; j++) {
                const v = vMin + j * dv;
                const r = ((H * H - v * v) / P);

                const x = r * Math.cos(u);
                const y = r * Math.sin(u);
                const z = v;

                vertices.push(x, y, z);
            }
        }

        for (let i = 0; i < uSteps; i++) {
            for (let j = 0; j < vSteps; j++) {
                const a = i * (vSteps + 1) + j;
                const b = a + 1;
                const c = a + (vSteps + 1);
                const d = c + 1;

                indices.push(a, b, c);
                indices.push(c, b, d);
            }
        }

        this.BufferData(new Float32Array(vertices), new Uint16Array(indices));
    };
}