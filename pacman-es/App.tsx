
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Direction, GameState, TileType, Point } from './types';
import { INITIAL_MAZE, TICK_RATE, GHOST_COLORS, POWER_DURATION, TILE_SIZE } from './constants';
import { findPathBFS } from './services/dataStructures';

// Tipos para el sistema de comentarios educativos
type GameEvent = 'pelletEaten' | 'powerPellet' | 'ghostClose' | 'ghostEaten' | 'collision' | 'victory' | 'idle';
type ConceptType = 'matrix' | 'bfs' | 'fsm' | 'queue';

const App: React.FC = () => {
	const { t } = useTranslation('common');
	const [lastEatTime, setLastEatTime] = useState(0);
	const [activeEvent, setActiveEvent] = useState<GameEvent>('idle');
	const [activeConcept, setActiveConcept] = useState<ConceptType>('matrix');
	const [bfsQueueSize, setBfsQueueSize] = useState(0);
	
	const [gameState, setGameState] = useState<GameState>({
		pacmanPos: { x: 9, y: 15 },
		pacmanDir: Direction.NONE,
		score: 0,
		lives: 3,
		maze: INITIAL_MAZE.map(row => [...row]),
		ghosts: [
			{ id: '1', position: { x: 9, y: 7 }, color: GHOST_COLORS.blinky, direction: Direction.NONE, isFrightened: false, type: 'blinky' },
			{ id: '2', position: { x: 8, y: 9 }, color: GHOST_COLORS.pinky, direction: Direction.NONE, isFrightened: false, type: 'pinky' },
			{ id: '3', position: { x: 9, y: 9 }, color: GHOST_COLORS.inky, direction: Direction.NONE, isFrightened: false, type: 'inky' },
			{ id: '4', position: { x: 10, y: 9 }, color: GHOST_COLORS.clyde, direction: Direction.NONE, isFrightened: false, type: 'clyde' },
		],
		isGameOver: false,
		isPaused: true,
		isWin: false,
		powerMode: 0,
	});

	const nextDirRef = useRef<Direction>(Direction.NONE);
	const gridRows = gameState.maze.length;
	const gridCols = gameState.maze[0].length;
	
	// Tamaños mejorados para mejor visibilidad educativa
	const tileSize = TILE_SIZE;
	const entitySize = Math.round(tileSize * 0.88);
	const pelletSize = Math.max(8, Math.round(tileSize * 0.28));
	const powerPelletSize = Math.max(16, Math.round(tileSize * 0.52));
	
	// Cálculo de pellets restantes
	const remainingPellets = useMemo(() => {
		return gameState.maze.reduce((count, row) => {
			const rowCount = row.filter(
				(tile) => tile === TileType.PELLET || tile === TileType.POWER_PELLET
			).length;
			return count + rowCount;
		}, 0);
	}, [gameState.maze]);

	// Configuración de estado visual
	const statusConfig = gameState.isGameOver
		? { label: t('pacman.gameOver'), className: "text-red-400", dotClass: "bg-red-500" }
		: gameState.isWin
			? { label: t('pacman.victory'), className: "text-emerald-300", dotClass: "bg-emerald-500" }
			: gameState.isPaused
				? { label: t('pacman.paused'), className: "text-amber-300", dotClass: "bg-amber-500" }
				: { label: t('pacman.playing'), className: "text-green-300", dotClass: "bg-green-500" };
	
	const powerActive = gameState.powerMode > 0;
	const scoreLabel = gameState.score.toString().padStart(5, '0');

	// Determinar el modo actual de los fantasmas
	const ghostModeLabel = powerActive 
		? t('pacman.frightened')
		: t('pacman.chase');
	const ghostModeClass = powerActive ? 'state-frightened' : 'state-chase';

	// Obtener comentario educativo basado en evento
	const getEducationalComment = useCallback((event: GameEvent): string => {
		const comments: Record<GameEvent, string> = {
			pelletEaten: t('pacman.iaComments.pelletEaten'),
			powerPellet: t('pacman.iaComments.powerPellet'),
			ghostClose: t('pacman.iaComments.ghostClose', { count: bfsQueueSize }),
			ghostEaten: t('pacman.iaComments.ghostEaten'),
			collision: t('pacman.iaComments.collision'),
			victory: t('pacman.iaComments.victory'),
			idle: t('pacman.iaComments.idle'),
		};
		return comments[event];
	}, [t, bfsQueueSize]);

	// Obtener explicación del concepto activo
	const getConceptExplanation = useCallback((concept: ConceptType): string => {
		const { pacmanPos } = gameState;
		const explanations: Record<ConceptType, string> = {
			matrix: t('pacman.conceptMatrix', { x: pacmanPos.x, y: pacmanPos.y }),
			bfs: t('pacman.conceptBfs'),
			fsm: t('pacman.conceptFsm'),
			queue: t('pacman.conceptQueue'),
		};
		return explanations[concept];
	}, [t, gameState.pacmanPos]);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key) > -1) {
			e.preventDefault();
		}

		switch (e.key) {
			case 'ArrowUp': case 'w': case 'W': nextDirRef.current = Direction.UP; break;
			case 'ArrowDown': case 's': case 'S': nextDirRef.current = Direction.DOWN; break;
			case 'ArrowLeft': case 'a': case 'A': nextDirRef.current = Direction.LEFT; break;
			case 'ArrowRight': case 'd': case 'D': nextDirRef.current = Direction.RIGHT; break;
			case ' ': 
				setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })); 
				break;
		}
	}, []);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	const isWall = useCallback((pos: Point) => {
		if (pos.y < 0 || pos.y >= gameState.maze.length) return true;
		if (pos.x < 0 || pos.x >= gameState.maze[0].length) return false;
		return gameState.maze[pos.y][pos.x] === TileType.WALL;
	}, [gameState.maze]);

	const getNextPos = useCallback((pos: Point, dir: Direction): Point => {
		let nextPos = { ...pos };
		if (dir === Direction.UP) nextPos.y -= 1;
		if (dir === Direction.DOWN) nextPos.y += 1;
		if (dir === Direction.LEFT) nextPos.x -= 1;
		if (dir === Direction.RIGHT) nextPos.x += 1;

		if (nextPos.x < 0) nextPos.x = 18;
		if (nextPos.x > 18) nextPos.x = 0;
		return nextPos;
	}, []);

	const gameTick = useCallback(() => {
		if (gameState.isPaused || gameState.isGameOver) return;

		setGameState(prev => {
			let currentDir = prev.pacmanDir;
			const intendedPos = getNextPos(prev.pacmanPos, nextDirRef.current);
			if (!isWall(intendedPos)) currentDir = nextDirRef.current;

			let nextPacPos = getNextPos(prev.pacmanPos, currentDir);
			if (isWall(nextPacPos)) nextPacPos = { ...prev.pacmanPos };

			let newMaze = prev.maze.map(row => [...row]);
			let newScore = prev.score;
			let newPowerMode = Math.max(0, prev.powerMode - 1);
			
			const currentTile = newMaze[nextPacPos.y][nextPacPos.x];
			if (currentTile === TileType.PELLET) {
				newMaze[nextPacPos.y][nextPacPos.x] = TileType.EMPTY;
				newScore += 10;
				setLastEatTime(Date.now());
				setActiveEvent('pelletEaten');
				setActiveConcept('matrix');
			} else if (currentTile === TileType.POWER_PELLET) {
				newMaze[nextPacPos.y][nextPacPos.x] = TileType.EMPTY;
				newScore += 50;
				newPowerMode = POWER_DURATION;
				setLastEatTime(Date.now());
				setActiveEvent('powerPellet');
				setActiveConcept('fsm');
			}

			// Movimiento de fantasmas con BFS
			let totalQueueSize = 0;
			const newGhosts = prev.ghosts.map(ghost => {
				const target = newPowerMode > 0 ? { x: 0, y: 0 } : nextPacPos;
				const path = findPathBFS(ghost.position, target, newMaze);
				totalQueueSize += path ? path.length : 0;
				let nextPos = ghost.position;
				if (path && path.length > 1) nextPos = path[1];
				return { ...ghost, position: nextPos, isFrightened: newPowerMode > 0 };
			});
			setBfsQueueSize(totalQueueSize);

			// Verificar si fantasmas están cerca
			const ghostsClose = newGhosts.some(g => {
				const dist = Math.abs(g.position.x - nextPacPos.x) + Math.abs(g.position.y - nextPacPos.y);
				return dist <= 3;
			});
			if (ghostsClose && !newPowerMode) {
				setActiveEvent('ghostClose');
				setActiveConcept('bfs');
			}

			let newLives = prev.lives;
			let newGameOver = false;
			let finalPacPos = nextPacPos;

			const collision = newGhosts.some(g => g.position.x === nextPacPos.x && g.position.y === nextPacPos.y);
			if (collision) {
				if (newPowerMode > 0) {
					newScore += 200;
					setActiveEvent('ghostEaten');
				} else {
					newLives -= 1;
					finalPacPos = { x: 9, y: 15 };
					setActiveEvent('collision');
					if (newLives <= 0) newGameOver = true;
				}
			}

			const hasPellets = newMaze.flat().some(t => t === TileType.PELLET);
			if (!hasPellets) {
				setActiveEvent('victory');
			}

			return {
				...prev,
				pacmanPos: finalPacPos,
				pacmanDir: currentDir,
				maze: newMaze,
				score: newScore,
				ghosts: newGhosts,
				powerMode: newPowerMode,
				lives: newLives,
				isGameOver: newGameOver,
				isWin: !hasPellets,
				isPaused: newGameOver || !hasPellets
			};
		});
	}, [gameState.isPaused, gameState.isGameOver, isWall, getNextPos]);

	useEffect(() => {
		const timer = setInterval(gameTick, TICK_RATE);
		return () => clearInterval(timer);
	}, [gameTick]);

	// Resetear evento a idle después de un tiempo
	useEffect(() => {
		if (activeEvent !== 'idle' && gameState.isPaused) {
			setActiveEvent('idle');
		}
	}, [gameState.isPaused, activeEvent]);

	return (
		<div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-cyan-500/30">
			{/* Layout Split 50/50 */}
			<div className="w-full pt-20 xl:pt-24">
				<div className="flex flex-col xl:flex-row min-h-[calc(100vh-5rem)]">
					
					{/* PANEL IZQUIERDO: JUEGO (50%) */}
					<div className="w-full xl:w-1/2 flex flex-col items-center justify-center p-4 xl:p-6 xl:sticky xl:top-24 xl:h-[calc(100vh-6rem)]">
						
						{/* Contenedor del Juego */}
						<div className="relative p-6 bg-gradient-to-b from-[#0d1117] to-[#0a0a0f] border border-blue-500/20 rounded-3xl shadow-[0_0_60px_rgba(59,130,246,0.1)]">
							
							{/* Barra de Estado y Puntuación */}
							<div className="flex justify-between items-end mb-6 px-2">
								<div className="space-y-1">
									<p className="text-[10px] font-retro text-blue-400/60 uppercase tracking-widest">{t('pacman.coreState')}</p>
									<div className="flex items-center gap-2">
										<div className={`h-2.5 w-2.5 rounded-full animate-pulse ${statusConfig.dotClass}`}></div>
										<span className={`text-sm font-retro tracking-widest ${statusConfig.className}`}>{statusConfig.label}</span>
									</div>
								</div>
								<div className="text-right space-y-1">
									<p className="text-[10px] font-retro text-pink-400/60 uppercase tracking-widest">{t('pacman.dataScore')}</p>
									<p className={`text-4xl font-retro text-white tracking-tighter leading-none transition-all duration-100 ${Date.now() - lastEatTime < 150 ? 'scale-110 text-yellow-400' : ''}`}>
										{scoreLabel}
									</p>
								</div>
							</div>

							{/* Grid del Laberinto */}
							<div
								className="maze-grid relative mx-auto"
								style={{
									display: 'grid',
									gridTemplateColumns: `repeat(${gridCols}, ${tileSize}px)`,
									gridTemplateRows: `repeat(${gridRows}, ${tileSize}px)`,
									width: 'fit-content',
									gap: 0,
								}}
							>
								{gameState.maze.map((row, y) =>
									row.map((tile, x) => (
										<div
											key={`${x}-${y}`}
											className="flex items-center justify-center relative"
											style={{ width: tileSize, height: tileSize }}
										>
											{tile === TileType.WALL && (
												<div className="w-full h-full wall-cell" />
											)}
											{tile === TileType.PELLET && (
												<div
													className="pellet"
													style={{ width: pelletSize, height: pelletSize }}
												/>
											)}
											{tile === TileType.POWER_PELLET && (
												<div
													className="power-pellet"
													style={{ width: powerPelletSize, height: powerPelletSize }}
												/>
											)}
										</div>
									))
								)}

								{/* Pac-Man */}
								<div
									className="absolute smooth-move z-30"
									style={{
										left: `${gameState.pacmanPos.x * tileSize + tileSize / 2}px`,
										top: `${gameState.pacmanPos.y * tileSize + tileSize / 2}px`,
										transform: 'translate(-50%, -50%)'
									}}
								>
									<PacmanIcon direction={gameState.pacmanDir} size={entitySize} isPowered={powerActive} />
								</div>

								{/* Fantasmas */}
								{gameState.ghosts.map(ghost => (
									<div
										key={ghost.id}
										className="absolute smooth-move z-20"
										style={{
											left: `${ghost.position.x * tileSize + tileSize / 2}px`,
											top: `${ghost.position.y * tileSize + tileSize / 2}px`,
											transform: 'translate(-50%, -50%)'
										}}
									>
										<GhostIcon
											color={ghost.isFrightened ? '#3b82f6' : ghost.color}
											size={entitySize}
											isFrightened={ghost.isFrightened}
										/>
									</div>
								))}

								{/* Pantallas de Overlay */}
								{(gameState.isPaused || gameState.isGameOver || gameState.isWin) && (
									<div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center rounded-2xl z-50 backdrop-blur-sm animate-fade-in">
										<div className="space-y-6 text-center px-6">
											{gameState.isGameOver ? (
												<div className="space-y-2">
													<h2 className="text-red-500 font-retro text-3xl tracking-tighter animate-pulse uppercase">{t('pacman.gameOver')}</h2>
													<p className="text-red-500/50 text-[10px] font-retro uppercase tracking-[0.2em]">{t('pacman.bufferOverrun')}</p>
												</div>
											) : gameState.isWin ? (
												<div className="space-y-2">
													<h2 className="text-green-400 font-retro text-3xl tracking-tighter uppercase">{t('pacman.compilationSuccess')}</h2>
													<p className="text-green-400/50 text-[10px] font-retro uppercase tracking-[0.2em]">{t('pacman.zeroErrors')}</p>
												</div>
											) : (
												<div className="space-y-2">
													<h2 className="text-cyan-400 font-retro text-2xl tracking-[0.15em] uppercase">{t('pacman.breakPoint')}</h2>
													<p className="text-cyan-400/50 text-[10px] font-retro uppercase tracking-[0.2em]">{t('pacman.executionSuspended')}</p>
												</div>
											)}
											
											<button
												onClick={() => {
													if (gameState.isGameOver || gameState.isWin) window.location.reload();
													else setGameState(prev => ({ ...prev, isPaused: false }));
												}}
												className="px-8 py-3 bg-cyan-500/20 text-cyan-400 font-retro text-[11px] rounded-xl border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest"
											>
												{gameState.isGameOver || gameState.isWin ? t('pacman.restartCore') : t('pacman.resumeThread')}
											</button>
											<p className="text-white/30 text-[10px] font-retro tracking-widest uppercase">{t('pacman.controls')}</p>
										</div>
									</div>
								)}
							</div>

							{/* Barra de Estado Inferior */}
							<div className="flex justify-between items-center mt-6 px-2 border-t border-white/5 pt-4">
								<div className="flex gap-6">
									<div className="space-y-1">
										<p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{t('pacman.energy')}</p>
										<p className={`text-xs font-retro ${powerActive ? "text-blue-400" : "text-white/20"}`}>
											{powerActive ? `POWER: ${gameState.powerMode}` : "NORMAL"}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{t('pacman.units')}</p>
										<div className="flex gap-1.5">
											{[...Array(3)].map((_, i) => (
												<div
													key={i}
													className={`h-3 w-3 rounded-full border border-white/10 ${i < gameState.lives ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-white/5'}`}
												/>
											))}
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{t('pacman.pelletsRemaining')}</p>
									<p className="text-sm font-retro text-yellow-400/80">{remainingPellets}</p>
								</div>
							</div>
						</div>
					</div>

					{/* PANEL DERECHO: EDUCATIVO (50%) */}
					<div className="w-full xl:w-1/2 p-4 xl:p-6 xl:overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a0a0f] to-[#0d1117]">
						<div className="max-w-xl mx-auto space-y-6">
							
							{/* Encabezado */}
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="h-0.5 w-6 bg-cyan-500"></span>
									<p className="text-cyan-400 font-retro text-[10px] tracking-[0.2em] uppercase">{t('pacman.openSourceLab')}</p>
								</div>
								<h1 className="text-3xl lg:text-4xl font-retro text-white tracking-tight leading-tight">
									PAC-MAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DATA LAB</span>
								</h1>
								<p className="text-white/40 text-sm leading-relaxed">
									{t('pacman.subtitleLong')}
								</p>
							</div>

							{/* Monitor de Aprendizaje IA */}
							<div className="relative p-5 bg-[#0d1117] border border-cyan-500/20 rounded-2xl overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent"></div>
								
								<div className="flex items-center gap-3 mb-4">
									<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-900/30 text-cyan-400 border border-cyan-500/20">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
									</div>
									<div>
										<p className="text-cyan-500 font-retro text-[9px] tracking-[0.15em] uppercase">{t('pacman.iaMonitor')}</p>
										<div className="flex items-center gap-2 mt-0.5">
											<div className="h-1 w-10 bg-cyan-900/40 rounded-full overflow-hidden">
												<div className="h-full bg-cyan-500 w-2/3 animate-pulse"></div>
											</div>
										</div>
									</div>
								</div>

								<div className="relative pl-4 border-l-2 border-cyan-500/30 py-1">
									<p className="text-white/80 text-base font-medium leading-relaxed typing-cursor">
										{getEducationalComment(activeEvent)}
									</p>
								</div>
							</div>

							{/* Estado en Tiempo Real */}
							<div className="p-5 bg-[#0d1117] border border-white/10 rounded-2xl">
								<div className="flex items-center gap-2 mb-4">
									<div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
									<h3 className="text-green-400 font-retro text-[10px] tracking-widest uppercase">{t('pacman.liveState')}</h3>
								</div>
								
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-white/40 text-[10px] uppercase mb-1">{t('pacman.position')}</p>
										<p className="font-mono text-cyan-400">[{gameState.pacmanPos.x}, {gameState.pacmanPos.y}]</p>
									</div>
									<div>
										<p className="text-white/40 text-[10px] uppercase mb-1">{t('pacman.currentCell')}</p>
										<p className="font-mono text-yellow-400">maze[{gameState.pacmanPos.y}][{gameState.pacmanPos.x}]</p>
									</div>
									<div className="col-span-2">
										<p className="text-white/40 text-[10px] uppercase mb-1">{t('pacman.ghostMode')}</p>
										<span className={`state-indicator ${ghostModeClass}`}>
											<span className="h-1.5 w-1.5 rounded-full bg-current"></span>
											{ghostModeLabel}
										</span>
									</div>
								</div>
							</div>

							{/* Concepto Destacado */}
							<div className="p-5 bg-gradient-to-br from-cyan-950/30 to-blue-950/20 border border-cyan-500/20 rounded-2xl">
								<div className="flex items-center gap-2 mb-3">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
									<h3 className="text-cyan-400 font-retro text-[10px] tracking-widest uppercase">{t('pacman.conceptHighlight')}</h3>
								</div>
								<p className="text-white/70 text-sm leading-relaxed font-mono">
									{getConceptExplanation(activeConcept)}
								</p>
							</div>

							{/* Grid de Arquitectura Técnica */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<ConceptCard
									title={t('pacman.matrices2d')}
									desc={t('pacman.matricesDesc')}
									color="blue"
									isActive={activeConcept === 'matrix'}
								/>
								<ConceptCard
									title={t('pacman.bfsAlgo')}
									desc={t('pacman.bfsDesc')}
									color="pink"
									isActive={activeConcept === 'bfs'}
								/>
								<ConceptCard
									title={t('pacman.pathfinding')}
									desc={t('pacman.pathfindingDesc')}
									color="green"
									isActive={activeConcept === 'queue'}
								/>
								<ConceptCard
									title={t('pacman.fsmLogic')}
									desc={t('pacman.fsmDesc')}
									color="amber"
									isActive={activeConcept === 'fsm'}
								/>
							</div>

							{/* Controles e Instrucciones */}
							<div className="grid grid-cols-1 gap-3">
								<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
									<div className="flex items-center gap-2 mb-3">
										<div className="h-1.5 w-1.5 bg-cyan-500 rounded-full"></div>
										<h3 className="text-cyan-400 font-retro text-[9px] tracking-widest uppercase">{t('pacman.inputMap')}</h3>
									</div>
									<div className="flex flex-wrap gap-2">
										<kbd className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/60">W A S D</kbd>
										<kbd className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/60">← ↑ ↓ →</kbd>
										<kbd className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-[10px] font-mono text-cyan-400">SPACE</kbd>
									</div>
								</div>

								<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
									<div className="flex items-center gap-2 mb-3">
										<div className="h-1.5 w-1.5 bg-yellow-500 rounded-full"></div>
										<h3 className="text-yellow-400 font-retro text-[9px] tracking-widest uppercase">{t('pacman.memoryUnits')}</h3>
									</div>
									<p className="text-[11px] text-white/40 leading-relaxed">
										{t('pacman.memoryDesc')}
									</p>
								</div>
							</div>

							{/* Cómo Funciona */}
							<div className="p-5 bg-[#0d1117] border border-white/10 rounded-2xl">
								<h3 className="text-white font-retro text-sm mb-4 flex items-center gap-2">
									<span className="text-cyan-400">{'>'}</span>
									{t('pacman.howItWorks')}
								</h3>
								<div className="space-y-3 text-[11px] text-white/50 leading-relaxed">
									<p><span className="text-blue-400 font-bold">Matrix:</span> {t('pacman.matrixExplain')}</p>
									<p><span className="text-pink-400 font-bold">BFS:</span> {t('pacman.bfsExplain')}</p>
									<p><span className="text-amber-400 font-bold">FSM:</span> {t('pacman.fsmExplain')}</p>
								</div>
								{gameState.isPaused && !gameState.isGameOver && !gameState.isWin && (
									<p className="mt-4 text-cyan-400/60 text-[10px] font-retro tracking-wide animate-pulse">
										{t('pacman.startToLearn')}
									</p>
								)}
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Componente de tarjeta de concepto
interface ConceptCardProps {
	title: string;
	desc: string;
	color: 'blue' | 'pink' | 'green' | 'amber';
	isActive: boolean;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ title, desc, color, isActive }) => {
	const colorClasses = {
		blue: 'border-l-blue-500',
		pink: 'border-l-pink-500',
		green: 'border-l-green-500',
		amber: 'border-l-amber-500',
	};
	
	return (
		<div className={`rounded-xl border-l-[3px] ${colorClasses[color]} bg-white/[0.02] p-4 transition-all duration-300 border border-white/5 ${isActive ? 'concept-active' : 'hover:bg-white/[0.04]'}`}>
			<h4 className="text-white font-bold text-[11px] mb-1.5 uppercase tracking-wide">{title}</h4>
			<p className="text-white/40 text-[10px] leading-relaxed">{desc}</p>
		</div>
	);
};

// Componente Pac-Man mejorado
interface PacmanIconProps {
	direction: Direction;
	size: number;
	isPowered: boolean;
}

const PacmanIcon: React.FC<PacmanIconProps> = ({ direction, size, isPowered }) => {
	const rotation = {
		[Direction.UP]: -90,
		[Direction.DOWN]: 90,
		[Direction.LEFT]: 180,
		[Direction.RIGHT]: 0,
		[Direction.NONE]: 0,
	}[direction];
	
	const pacmanColor = isPowered ? '#38bdf8' : '#facc15';
	const glowColor = isPowered ? 'rgba(56, 189, 248, 0.6)' : 'rgba(250, 204, 21, 0.6)';
	
	return (
		<div
			className="relative transition-transform duration-100"
			style={{ 
				width: size, 
				height: size,
				transform: `rotate(${rotation}deg)`,
			}}
		>
			<svg 
				width={size} 
				height={size} 
				viewBox="0 0 100 100" 
				style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
			>
				<path
					d="M50,50 L95,15 A48,48 0 1,0 95,85 Z"
					fill={pacmanColor}
				>
					<animate 
						attributeName="d" 
						dur="0.2s" 
						repeatCount="indefinite" 
						values="M50,50 L95,15 A48,48 0 1,0 95,85 Z; M50,50 L95,45 A48,48 0 1,0 95,55 Z; M50,50 L95,15 A48,48 0 1,0 95,85 Z"
					/>
				</path>
				{/* Ojo */}
				<circle cx="55" cy="30" r="6" fill="#0a0a0f" />
			</svg>
		</div>
	);
};

// Componente Fantasma mejorado
interface GhostIconProps {
	color: string;
	size: number;
	isFrightened: boolean;
}

const GhostIcon: React.FC<GhostIconProps> = ({ color, size, isFrightened }) => {
	const glowColor = isFrightened ? 'rgba(59, 130, 246, 0.5)' : `${color}66`;
	
	return (
		<div 
			className="relative" 
			style={{ width: size, height: size }}
		>
			<svg 
				width={size} 
				height={size} 
				viewBox="0 0 100 100" 
				style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
			>
				{/* Cuerpo del fantasma con ondulación */}
				<path
					d="M10,88 L10,40 A40,40 0 0,1 90,40 L90,88 L78,78 L66,88 L54,78 L42,88 L30,78 L18,88 Z"
					fill={color}
				>
					<animate
						attributeName="d"
						dur="0.4s"
						repeatCount="indefinite"
						values="M10,88 L10,40 A40,40 0 0,1 90,40 L90,88 L78,78 L66,88 L54,78 L42,88 L30,78 L18,88 Z;
								M10,88 L10,40 A40,40 0 0,1 90,40 L90,88 L78,82 L66,88 L54,82 L42,88 L30,82 L18,88 Z;
								M10,88 L10,40 A40,40 0 0,1 90,40 L90,88 L78,78 L66,88 L54,78 L42,88 L30,78 L18,88 Z"
					/>
				</path>
				
				{/* Ojos */}
				{isFrightened ? (
					<>
						{/* Ojos asustados */}
						<circle cx="35" cy="42" r="8" fill="white" />
						<circle cx="65" cy="42" r="8" fill="white" />
						<circle cx="35" cy="44" r="4" fill="#1e40af" />
						<circle cx="65" cy="44" r="4" fill="#1e40af" />
						{/* Boca asustada */}
						<path d="M30,60 Q35,55 40,60 Q45,65 50,60 Q55,55 60,60 Q65,65 70,60" stroke="white" strokeWidth="3" fill="none" />
					</>
				) : (
					<>
						{/* Ojos normales */}
						<ellipse cx="35" cy="40" rx="10" ry="12" fill="white" />
						<ellipse cx="65" cy="40" rx="10" ry="12" fill="white" />
						<circle cx="38" cy="42" r="5" fill="#1e3a8a" />
						<circle cx="68" cy="42" r="5" fill="#1e3a8a" />
					</>
				)}
			</svg>
		</div>
	);
};

export default App;
