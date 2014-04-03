Canvasloth.prototype.Lights3D = function() {
	var gl = this.ctx,
	    shaders = this.shaders,
	    prog = shaders.program,
	    lights =
	this.lights = {
		_dir: [],
		uDirAct: [],
		uDirPos: [],
		uDirCol: [],
		nbDir: 0,
		uAmbCol: gl.getUniformLocation(prog, 'lightAmb_col'),
		enable: function() {
			this.active = true;
			this.ambient(0,0,0);
			return this;
		},
		disable: function() {
			this.ambient(1,1,1);
			this.active = false;
			return this;
		},
		ambient : function(r, g, b) {
			if (this.active)
				gl.uniform3f(this.uAmbCol, r, g, b);
			return this;
		},
		dir: function(light) {
			return this._dir[light] || (
				this.nbDir >= shaders.DIRLIGHTS_MAX
					? null
					: (this._dir[light] = new Canvasloth.Light(this, gl, this.nbDir++))
			);
		}
	};
	for (var i = 0; i < shaders.DIRLIGHTS_MAX; ++i) {
		lights.uDirAct.push(gl.getUniformLocation(prog, 'dir['+i+'].act'));
		lights.uDirPos.push(gl.getUniformLocation(prog, 'dir['+i+'].pos'));
		lights.uDirCol.push(gl.getUniformLocation(prog, 'dir['+i+'].col'));
	}
};

Canvasloth.Light = function(lights, gl, id) {
	this.gl = gl;
	this.uAct = lights.uDirAct[id];
	this.uPos = lights.uDirPos[id];
	this.uCol = lights.uDirCol[id];
	this.enable()
	    .pos(0,0,0)
	    .col(255,255,255);
};

Canvasloth.Light.prototype = {
	enable:  function() { this.gl.uniform1i(this.uAct, this._active = 1); return this; },
	disable: function() { this.gl.uniform1i(this.uAct, this._active = 0); return this; },
	toggle:  function() { return this._active ? this.disable() : this.enable(); },
	col: function(r, g, b) {
		if (r === undefined)
			return this.vCol;
		this.vCol = g === undefined ? r : [r, g, b];
		this.gl.uniform3fv(this.uCol, this.vCol);
		return this;
	},
	pos: function(x, y, z) {
		if (x === undefined)
			return this.vPos;
		this.vPos = y === undefined ? x : [x, y, z];
		vec3.normalize(this.vPos, this.vPos);
		vec3.scale(this.vPos, this.vPos, -1);
		this.gl.uniform3fv(this.uPos, this.vPos);
		return this;
	}
};
