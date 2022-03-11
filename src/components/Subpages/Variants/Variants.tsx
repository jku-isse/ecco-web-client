import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState } from "react";
import { CreateVariant } from "./Variants.CreateVariantModal";

import { Container, Col, Row, InputGroup, Table, Button, ListGroup, Card, DropdownButton, Dropdown, Badge, FormControl } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { DeleteVariantModal } from "./Variants.DeleteVariantModal";
import { FeatureModel } from "../../../model/FeatureModel";
import { RemoveFeatureModal } from "./Variants.Feature.RemoveFeatureModal";
import { Features } from "./Variants.Feature";


export const Variants: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedVariant, setSelectedVariant] = useState<VariantModel>(null);
    const [variantFilterText, setVariantFilterText] = useState<string>("");
    const [featureFilter, setFeatureFilter] = useState<FeatureModel[]>([]);

    const getCurrentVariantExpression = (): JSX.Element[] => {

        var filteredByFeatures = appState.repository?.variants.filter(vari => featureFilter.map(f => f.name).every(e => vari.configuration.featureRevisions.map(r => r.featureRevisionString.split('.')[0]).includes(e)));

        return filteredByFeatures.map((variant: VariantModel, i) => {
            if (variant.name.toLowerCase().includes(variantFilterText.toLowerCase())) {
                return (
                    <tr style={{ width: '100%' }} onClick={() => setSelectedVariant(variant)} className={selectedVariant == variant ? "btn-primary" : null} key={i}>
                        <td width="20%">TODO {variant.name}</td>
                        <td style={{ width: '80%' }}>{variant.description}</td>
                    </tr>
                );
            }
        }).filter((singleJSXElement: JSX.Element) => {
            return singleJSXElement != undefined || singleJSXElement != null;
        });
    }
    let filteredVariants = getCurrentVariantExpression();

    let addFeatureFilter = (name: FeatureModel) => {
        setFeatureFilter([...featureFilter, name]);
    }

    let removeFeatureFilter = (name: FeatureModel) => {
        setFeatureFilter([...featureFilter].filter(n => n != name));
    }

    let featureFilterDropdown = appState.repository.features.filter(
        f => featureFilter.indexOf(f) == -1
    )

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <h3>Variants</h3>
                </Row>
                <Row>
                    <Col xs={8}>
                        <Table hover size='sm' className="table-fixed table-responsive" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '20%' }}>Name</th>
                                    <th style={{ minWidth: '80%' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVariants}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Row className="mb-3">
                            <Col xs={6}><CreateVariant /></Col>
                            <Col xs={6}>
                                <DeleteVariantModal variant={selectedVariant} />
                            </Col>

                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                                <FormControl
                                    placeholder="Variantname for filtering..."
                                    onChange={e => setVariantFilterText(e.target.value)}
                                    value={variantFilterText}
                                />
                                {variantFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setVariantFilterText("")}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <DropdownButton bsPrefix="dropdown-toggle btn btn-custom-color dropdown-btn" style={{border: '1px solid #ced4da'}} disabled={featureFilterDropdown.length == 0} title="">
                                    {featureFilterDropdown.map((feature, i) => {
                                        return (
                                            <Dropdown.Item key={i} onClick={() => addFeatureFilter(feature)}>{feature.name}</Dropdown.Item>
                                        )
                                    })}
                                </DropdownButton>
                                <div className='form-control py-0 px-0'>
                                    <div className="d-flex flex-wrap px-0" style={{ minHeight: '46px' }}>
                                        {featureFilter?.map((feature, i) => {
                                            return (
                                                <Button className="ms-1 my-1" size='sm' onClick={() => removeFeatureFilter(feature)} key={i}>{feature.name} <i className="bi bi-x-lg"></i></Button>
                                            )
                                        })}
                                    </div>
                                </div>
                                {featureFilter.length > 0 ? <Button variant="outline-primary" onClick={() => setFeatureFilter([])}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Row>
                    </Col>
                </Row>
                {selectedVariant != null &&
                    <>
                        <Row>
                            <Features variant={selectedVariant} />
                            <Col xs={3} className="mr-auto mb-3">
                                <h5>Associations</h5>
                            </Col>
                        </Row>
                        <Row className="my-4 float-end"><Button className="w-100">Checkout Variant</Button>
                        </Row>
                    </>
                }
            </Col >
        </Container >
    )
}
