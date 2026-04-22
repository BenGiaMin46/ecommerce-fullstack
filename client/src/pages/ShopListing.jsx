import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import styled from "styled-components";
import { filter } from "../utils/data";
import { CircularProgress, Slider, Chip, Badge } from "@mui/material";
import { getAllProducts } from "../api";
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

const Container = styled.div`
  padding: 30px;
  min-height: 100%;
  overflow-y: auto;
  display: flex;
  gap: 30px;
  
  @media (max-width: 900px) {
    padding: 20px 16px;
    flex-direction: column;
  }
  background: ${({ theme }) => theme.bg};
`;

const Header = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ResultsCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const ClearFiltersBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + '15'};
  }
`;
const Filters = styled.div`
  width: 280px;
  height: fit-content;
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow_sm};
  position: sticky;
  top: 100px;
  
  @media (max-width: 900px) {
    width: 100%;
    position: static;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;
const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Products = styled.div`
  flex: 1;
  min-width: 0;
`;

const PageState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 2rem;
`;

const EmptyState = styled(PageState)`
  flex-direction: column;
  text-align: center;
  gap: 0.7rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
`;

const ErrorState = styled(EmptyState)`
  border-style: solid;
  border-color: ${({ theme }) => theme.error + "50"};
`;
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 20px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectableItem = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme, selected }) => selected ? theme.primary : theme.border};
  color: ${({ theme, selected }) => selected ? theme.primary : theme.text_secondary};
  background: ${({ theme, selected }) => selected ? theme.primary + '15' : 'transparent'};
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 48px;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const PriceRange = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-top: 8px;
`;

const MobileFilterToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 10px 16px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  
  @media (max-width: 900px) {
    display: flex;
  }
`;


const ShopListing = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const searchQuery = queryParams.get("search") || "";

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  const getFilteredProductsData = useCallback(async () => {
    setLoading(true);
    setApiError("");
    let query = `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
    if (selectedSizes.length > 0) query += `&sizes=${selectedSizes.join(",")}`;
    if (selectedCategories.length > 0) query += `&categories=${selectedCategories.join(",")}`;
    if (searchQuery) query += `&search=${searchQuery}`;

    try {
      const res = await getAllProducts(query);
      setProducts(res.data);
    } catch (error) {
      setProducts([]);
      setApiError("Khong the ket noi den server/DB. Vui long kiem tra backend.");
    } finally {
      setLoading(false);
    }
  }, [priceRange, selectedSizes, selectedCategories, searchQuery]);

  useEffect(() => {
    getFilteredProductsData();
  }, [getFilteredProductsData]);

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    if (searchQuery) navigate("/shop");
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 1000 || selectedSizes.length > 0 || selectedCategories.length > 0 || searchQuery;

  const allActiveFilters = [
    ...selectedSizes.map(s => ({ type: 'size', value: s })),
    ...selectedCategories.map(c => ({ type: 'category', value: c })),
    ...(priceRange[0] > 0 || priceRange[1] < 1000 ? [{ type: 'price', value: `$${priceRange[0]} - $${priceRange[1]}` }] : []),
    ...(searchQuery ? [{ type: 'search', value: `Search: "${searchQuery}"` }] : [])
  ];

  if (loading) {
    return (
      <Container>
        <PageState>
          <CircularProgress size={60} />
        </PageState>
      </Container>
    );
  }

  return (
    <>
      <Header>
        <HeaderTop>
          <div>
            <PageTitle>
              <TuneIcon sx={{ fontSize: 28 }} />
              Shop
            </PageTitle>
            <ResultsCount>{products.length} products found</ResultsCount>
          </div>
          <MobileFilterToggle onClick={() => setFiltersOpen(!filtersOpen)}>
            <FilterListIcon sx={{ fontSize: 18 }} />
            Filters
            {hasActiveFilters && (
              <Badge color="primary" variant="dot" />
            )}
          </MobileFilterToggle>
        </HeaderTop>
        
        {hasActiveFilters && (
          <ActiveFilters>
            {allActiveFilters.map((filter, idx) => (
              <Chip
                key={idx}
                label={filter.value}
                onDelete={() => {
                  if (filter.type === 'size') {
                    setSelectedSizes(prev => prev.filter(s => s !== filter.value));
                  } else if (filter.type === 'category') {
                    setSelectedCategories(prev => prev.filter(c => c !== filter.value));
                  } else if (filter.type === 'price') {
                    setPriceRange([0, 1000]);
                  }
                }}
                size="small"
                sx={{ fontWeight: 500 }}
              />
            ))}
            <ClearFiltersBtn onClick={clearAllFilters}>
              <CloseIcon sx={{ fontSize: 14 }} />
              Clear all
            </ClearFiltersBtn>
          </ActiveFilters>
        )}
      </Header>

      <Container>
        <Filters isOpen={filtersOpen}>
          <FilterHeader>
            <FilterTitle>
              <FilterListIcon sx={{ fontSize: 18 }} />
              Filters
            </FilterTitle>
            {hasActiveFilters && (
              <ClearFiltersBtn onClick={clearAllFilters}>
                <CloseIcon sx={{ fontSize: 14 }} />
                Clear
              </ClearFiltersBtn>
            )}
          </FilterHeader>
          
          <Menu>
            {filter.map((filters) => (
              <FilterSection key={filters.value}>
                <SectionTitle>{filters.name}</SectionTitle>
                {filters.value === "price" ? (
                  <>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `$${value}`}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      sx={{
                        color: 'primary.main',
                        '& .MuiSlider-thumb': { width: 20, height: 20 },
                      }}
                    />
                    <PriceRange>
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </PriceRange>
                  </>
                ) : filters.value === "size" ? (
                  <Item>
                    {filters.items.map((item) => (
                      <SelectableItem
                        key={item}
                        selected={selectedSizes.includes(item)}
                        onClick={() =>
                          setSelectedSizes((prevSizes) =>
                            prevSizes.includes(item)
                              ? prevSizes.filter((s) => s !== item)
                              : [...prevSizes, item]
                          )
                        }
                      >
                        {item}
                      </SelectableItem>
                    ))}
                  </Item>
                ) : filters.value === "category" ? (
                  <Item>
                    {filters.items.map((item) => (
                      <SelectableItem
                        key={item}
                        selected={selectedCategories.includes(item)}
                        onClick={() =>
                          setSelectedCategories((prevCategories) =>
                            prevCategories.includes(item)
                              ? prevCategories.filter((c) => c !== item)
                              : [...prevCategories, item]
                          )
                        }
                      >
                        {item}
                      </SelectableItem>
                    ))}
                  </Item>
                ) : null}
              </FilterSection>
            ))}
          </Menu>
        </Filters>
        
        <Products>
          {apiError && (
            <ErrorState>
              <EmptyTitle>Server is unavailable</EmptyTitle>
              <p>{apiError}</p>
            </ErrorState>
          )}
          <CardWrapper>
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </CardWrapper>
          
          {products.length === 0 && !apiError && (
            <EmptyState>
              <EmptyTitle>No products found</EmptyTitle>
              <p>Try adjusting your filters to see more results.</p>
            </EmptyState>
          )}
        </Products>
      </Container>
    </>
  );
};

export default ShopListing;
