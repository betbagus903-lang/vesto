import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
                if (holding) {
                    // Gentle orbital behavior around hold center without teleporting particles.
                    const centerX = mouse.holdCenterX || mouse.x;
                    const centerY = mouse.holdCenterY || mouse.y;
                    const angleToCenter = Math.atan2(particle.y - centerY, particle.x - centerX);
                    const orbitSpeed = 0.0009 + (particle.chase * 0.0006);
                    const perp = angleToCenter + Math.PI / 2;

                    // Small perpendicular nudge for orbiting
                    particle.vx += Math.cos(perp) * 0.01 * dt * (0.6 + particle.response * 0.8);
                    particle.vy += Math.sin(perp) * 0.01 * dt * (0.6 + particle.response * 0.8);

                    // Mild radial pull only for particles reasonably close to center
                    const dxC = centerX - particle.x;
                    const dyC = centerY - particle.y;
                    const distC = Math.hypot(dxC, dyC) || 1;
                    if (distC < 260) {
                        const pull = clamp((260 - distC) / 260, 0, 1) * 0.006 * dt;
                        particle.vx += (dxC / distC) * pull;
                        particle.vy += (dyC / distC) * pull;
                    }

                    // subtle wobble for visual variety
                    particle.vx += Math.cos(time * 0.0012 + particle.phase) * 0.003 * dt;
                    particle.vy += Math.sin(time * 0.0012 + particle.phase) * 0.003 * dt;
                    // adjust visuals
                    particle.visualSize = particle.size * (1 + Math.min(0.6, 0.18 + Math.cos(time * 0.001 + particle.phase) * 0.12));
                    particle.visualAlpha = 0.6 + Math.abs(Math.sin(angleToCenter)) * 0.28;
                } else if (followCursor) {
}

export default function Heart() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const extraHoldRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0, hasPointer: false, isDown: false, bursting: false, holding: false, holdCenterX: 0, holdCenterY: 0, holdTimer: null, released: false, releaseCenterX: 0, releaseCenterY: 0, releaseTimer: null, spawnCount: 0, lastHoldBurst: 0, releaseForce: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
                createParticle(width, height)
            );
        };

        const handlePointerMove = (event) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
            mouseRef.current.hasPointer = true;
        };

        const clearHoldTimers = (mouse) => {
            if (mouse.holdTimer) {
                window.clearTimeout(mouse.holdTimer);
                mouse.holdTimer = null;
            }
            if (mouse.releaseTimer) {
                window.clearTimeout(mouse.releaseTimer);
                mouse.releaseTimer = null;
            }
        };

        const handlePointerLeave = () => {
            const mouse = mouseRef.current;
            mouse.hasPointer = false;
            mouse.isDown = false;
            mouse.holding = false;
            mouse.released = false;
            mouse.bursting = false;
            clearHoldTimers(mouse);
            extraHoldRef.current = [];
        };

        const startHold = (x, y) => {
            const mouse = mouseRef.current;
            if (!mouse.isDown) return;
            mouse.holding = true;
            mouse.holdCenterX = x;
            mouse.holdCenterY = y;
            mouse.bursting = true;
            mouse.released = false;
            mouse.lastHoldBurst = 0;
            mouse.releaseForce = 0;
            triggerBurst(1.6, 120);
            extraHoldRef.current = [];
            mouse.spawnCount = 0;
        };

        const triggerBurst = (strength, count) => {
            const mouse = mouseRef.current;
            mouse.bursting = true;
            mouse.released = false;
            particlesRef.current.slice(0, count).forEach((particle) => {
                particle.burst = 0.6 + Math.random() * 0.6 * strength;
                particle.burstAngle = Math.random() * Math.PI * 2;
                particle.burstRadius = 40 + Math.random() * 80 * strength;
            });
        };

        const handlePointerDown = (event) => {
            if (event.button !== 0) return;

            const x = event.clientX;
            const y = event.clientY;
            const mouse = mouseRef.current;

            clearHoldTimers(mouse);

            mouse.x = x;
            mouse.y = y;
            mouse.hasPointer = true;
            mouse.isDown = true;
            mouse.holding = false;
            mouse.bursting = true;
            mouse.released = false;
            mouse.releaseForce = 0;
            mouse.holdCenterX = x;
            mouse.holdCenterY = y;
            mouse.spawnCount = 0;
            extraHoldRef.current = [];

            triggerBurst(1.8, 120);
            mouse.holdTimer = window.setTimeout(() => startHold(x, y), 450);
        };

        const handlePointerUp = () => {
            const mouse = mouseRef.current;
            clearHoldTimers(mouse);

            if (mouse.holding) {
                mouse.holding = false;
                mouse.released = true;
                mouse.bursting = false;
                mouse.releaseCenterX = mouse.holdCenterX;
                mouse.releaseCenterY = mouse.holdCenterY;
                mouse.releaseForce = 1.2;
                triggerBurst(1.8, 160);
                mouse.releaseTimer = window.setTimeout(() => {
                    mouse.released = false;
                    mouse.releaseTimer = null;
                    mouse.releaseForce = 0;
                    extraHoldRef.current = [];
                }, 1700);
            } else if (mouse.isDown) {
                triggerBurst(1.4, 90);
                mouse.bursting = true;
            }

            mouse.isDown = false;
        };

        const animate = (time) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouse = mouseRef.current;
            const pulse = 0.8 + Math.sin(time * 0.0027) * 0.2;
            const dt = Math.min(1.4, 16.67 / (1000 / 60));

            const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.7);
            gradient.addColorStop(0, 'rgba(8, 12, 30, 0.96)');
            gradient.addColorStop(1, 'rgba(2, 4, 10, 1)');
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const allParticles = particlesRef.current;
            allParticles.forEach((particle) => {
                const swirlX = Math.sin(time * particle.drift + particle.phase) * 26;
                const swirlY = Math.cos(time * particle.drift * 0.8 + particle.phase * 1.3) * 20;
                let targetX = particle.x;
                let targetY = particle.y;

                const activeBurst = mouse.bursting && particlesRef.current.some((p) => p.burst > 0.01);
                if (mouse.bursting && !activeBurst && !mouse.holding) {
                    mouse.bursting = false;
                }
                const bursting = mouse.bursting && activeBurst;
                const holding = mouse.holding;
                const released = mouse.released;
                const followCursor = !bursting && !holding && mouse.hasPointer && !released && !mouse.isDown;

                if (holding && time - mouse.lastHoldBurst > 280) {
                    triggerBurst(1.0, 64);
                    mouse.lastHoldBurst = time;
                }

                // no extra special hold particles — use the regular particle set for Saturnus

                if (holding) {
                    const centerX = mouse.holdCenterX || mouse.x;
                    const centerY = mouse.holdCenterY || mouse.y;
                    const baseAngle = particle.phase + time * 0.0012;
                    const planetRadius = 62 + Math.sin(time * 0.0018 + particle.phase) * 10;
                    const ringRadius = 146 + Math.sin(time * 0.0015 + particle.phase) * 8;
                    const ringTilt = 0.38;
                    const depthAngle = baseAngle * 1.05 + particle.holdOffset * Math.PI * 2;
                    const depth = Math.cos(depthAngle);

                    if (particle.saturnRole === 'ring') {
                        const ringAngle = baseAngle * 0.98 + particle.holdOffset * Math.PI * 2;
                        const ringDepth = Math.cos(ringAngle);
                        targetX = centerX + Math.cos(ringAngle) * ringRadius;
                        targetY = centerY + Math.sin(ringAngle) * ringRadius * ringTilt + ringDepth * 16;
                        particle.visualSize = particle.size * (0.9 + ringDepth * 0.24);
                        particle.visualAlpha = 0.72 + ringDepth * 0.18;
                        particle.renderDepth = ringDepth;
                    } else {
                        const sphereAngle = baseAngle * 1.18 + particle.holdOffset * Math.PI * 2;
                        const sphereDepth = Math.cos(sphereAngle);
                        const sphereRadius = planetRadius * (0.4 + particle.holdOffset * 0.32);
                        targetX = centerX + Math.cos(sphereAngle) * sphereRadius;
                        targetY = centerY + Math.sin(sphereAngle) * sphereRadius * 0.64 + sphereDepth * 10;
                        particle.visualSize = particle.size * (0.9 + sphereDepth * 0.18);
                        particle.visualAlpha = 0.62 + sphereDepth * 0.18;
                        particle.renderDepth = sphereDepth * 0.52;
                    }

                    const dxCenter = centerX - particle.x;
                    const dyCenter = centerY - particle.y;
                    const distCenter = Math.hypot(dxCenter, dyCenter) || 1;
                    if (distCenter > 90) {
                        const pullStrength = clamp((distCenter - 90) / 360, 0, 1) * 0.022 * dt;
                        particle.vx += (dxCenter / distCenter) * pullStrength;
                        particle.vy += (dyCenter / distCenter) * pullStrength;
                    }
                    if (distCenter > 260) {
                        particle.vx += (dxCenter / distCenter) * 0.024 * dt;
                        particle.vy += (dyCenter / distCenter) * 0.024 * dt;
                    }

                    particle.vx += Math.cos(baseAngle + Math.PI / 2) * 0.01 * dt;
                    particle.vy += Math.sin(baseAngle + Math.PI / 2) * 0.01 * dt;
                } else if (followCursor) {
                    const angle = time * 0.0012 * particle.chase + particle.phase;
                    const radius = 28 + particle.response * 48 + Math.sin(time * 0.0011 + particle.phase) * 16;
                    const dx = mouse.x - particle.x;
                    const dy = mouse.y - particle.y;
                    const dist = Math.hypot(dx, dy) || 1;

                    const followX = mouse.x + Math.cos(angle) * radius;
                    const followY = mouse.y + Math.sin(angle) * radius;

                    targetX = followX + Math.sin(time * 0.0015 + particle.phase) * 8 * particle.lag;
                    targetY = followY + Math.cos(time * 0.0013 + particle.phase) * 6 * particle.lag;

                    particle.vx += (dx / dist) * 0.012 * dt * particle.response;
                    particle.vy += (dy / dist) * 0.012 * dt * particle.response;
                    particle.vx += Math.cos(angle + Math.PI / 2) * 0.008 * dt * particle.chase;
                    particle.vy += Math.sin(angle + Math.PI / 2) * 0.008 * dt * particle.chase;
                } else if (released) {
                    const releaseX = mouse.releaseCenterX || mouse.holdCenterX || mouse.x;
                    const releaseY = mouse.releaseCenterY || mouse.holdCenterY || mouse.y;
                    const releaseDx = particle.x - releaseX;
                    const releaseDy = particle.y - releaseY;
                    const releaseDist = Math.hypot(releaseDx, releaseDy) || 1;
                    const fling = 0.24 + Math.min(1, releaseDist / 260) * 0.18;
                    particle.vx += (releaseDx / releaseDist) * fling * dt * (1 + mouse.releaseForce);
                    particle.vy += (releaseDy / releaseDist) * fling * dt * (1 + mouse.releaseForce);
                    particle.visualAlpha = Math.max(0.18, Math.min(0.75, 0.55 - releaseDist * 0.0009));
                    particle.visualSize = (particle.visualSize || particle.size) * 1.03;
                } else {
                    particle.vx += Math.cos(time * 0.0007 + particle.phase) * 0.0024 * dt;
                    particle.vy += Math.sin(time * 0.0007 + particle.phase) * 0.0024 * dt;
                    particle.visualSize = undefined;
                    particle.visualAlpha = undefined;
                    particle.renderDepth = undefined;
                }

                if (particle.burst > 0.01) {
                    const burstForce = 0.22 + particle.burst * 0.18;
                    const burstDistance = particle.burstRadius * (0.4 + particle.burst * 0.2);
                    targetX = mouse.x + Math.cos(particle.burstAngle) * burstDistance;
                    targetY = mouse.y + Math.sin(particle.burstAngle) * burstDistance;
                    particle.vx += Math.cos(particle.burstAngle) * burstForce * dt * particle.response;
                    particle.vy += Math.sin(particle.burstAngle) * burstForce * dt * particle.response;
                    particle.burst *= 0.88;
                } else if (bursting && particle.burst <= 0.01) {
                    particle.burst = 0;
                }

                const dx = targetX - particle.x;
                const dy = targetY - particle.y;

                particle.vx += dx * 0.0028 * dt * particle.response;
                particle.vy += dy * 0.0028 * dt * particle.response;
                particle.vx *= 0.94;
                particle.vy *= 0.94;
                particle.x += particle.vx * dt * (0.8 + particle.chase * 0.35);
                particle.y += particle.vy * dt * (0.8 + particle.chase * 0.35);

                if (particle.x < 8) {
                    particle.x = 8;
                    particle.vx *= -0.6;
                } else if (particle.x > width - 8) {
                    particle.x = width - 8;
                    particle.vx *= -0.6;
                }

                if (particle.y < 8) {
                    particle.y = 8;
                    particle.vy *= -0.6;
                } else if (particle.y > height - 8) {
                    particle.y = height - 8;
                    particle.vy *= -0.6;
                }

                particle.x = clamp(particle.x, 8, width - 8);
                particle.y = clamp(particle.y, 8, height - 8);

                const visualSize = particle.visualSize || particle.size * (mouse.hasPointer ? 1.4 : 1);
                const visualAlpha = particle.visualAlpha || (mouse.hasPointer ? 0.95 : 0.7);
                const depthTint = particle.renderDepth ? 1 - Math.abs(particle.renderDepth) * 0.22 : 1;
                const alpha = visualAlpha * depthTint;
                const size = visualSize * (0.85 + pulse * 0.2);

                ctx.beginPath();
                ctx.fillStyle = `hsla(${particle.hue}, 92%, ${Math.min(82, 72 + (particle.renderDepth || 0) * 10)}%, ${alpha})`;
                ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            frameId = window.requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        frameId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#05020b', color: 'white', position: 'relative' }}>
            <Head title="Heart" />
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100vh', cursor: 'crosshair' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem 2rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                    <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.9 }}>
                        Sardine Swarm
                    </div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.95rem', opacity: 0.8 }}>
                        Arahkan cursor ke layar untuk melihat kawanan partikel berputar dan mengalir.
                    </div>
                </div>
            </div>
        </div>
    );
}
