import GridView from "@ui/GridView";
import { LatestProduct } from "./LatestProductList";
import ProductCard from "@ui/ProductCard";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}

export default function ProductGridView({ data, onPress }: Props) {
    return (
        <GridView
            data={data}
            renderItem={(item) => <ProductCard product={item} onPress={onPress} />}
        />
    )
}