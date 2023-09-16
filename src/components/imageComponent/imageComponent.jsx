import { useEffect, useState, useRef } from 'react';
import ContentLoader from 'react-content-loader';

const ImageComponent = ({ height, src, active, setBikesState, index }) => {
	const [load, setLoad] = useState(false);
	const imgRef = useRef(null);

	const loadImageFunc = (bikesState, index) => {
		if (index === bikesState.length - 1) {
			const array = [...bikesState];
			array[0] = { ...array[0], active: true };
			return array;
		} else {
			const array = [...bikesState];
			array[index + 1] = { ...array[index + 1], active: true };
			return array;
		}
	};

	useEffect(() => {
		setLoad(imgRef?.current?.complete && active);
	}, []);
	return (
		<>
			<img
				ref={imgRef}
				style={{ display: load ? 'block' : 'none' }}
				height={height ? height : 0}
				src={active ? src : undefined}
				data-src={src}
				onLoad={() => {
					setBikesState((prevState) => loadImageFunc(prevState, index));
					setLoad(true);
				}}
			/>
			{!load && (
				<>
					{' '}
					<ContentLoader
						speed={2}
						width={400}
						style={{ position: 'absolute', top: 0, left: 0 }}
						height={height ? height : 0}
						viewBox={height ? `0 0 ${height * 1.78} ${height}` : null}
						backgroundColor="#f3f3f3"
						foregroundColor="#ecebeb">
						<rect x="0" y="0" rx="0" ry="0" width={height * 1.78} height={height} />
					</ContentLoader>
				</>
			)}
		</>
	);
};

export default ImageComponent;
