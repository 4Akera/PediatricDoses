$(document).ready(function() {
    let previousWeight = null;

    const categories = {
        'comprehensive-drugs': 'Comprehensive Drugs',
        'anti-epileptics': 'Anti-Epileptics',
        'blood-products': 'Blood Products',
        'syrups': 'Syrups',
        'dka': 'DKA'
    };

    $('#category').change(function() {
        const category = $(this).val();
        if (category) {
            $('#input-section').html(generateInputFields(category));
            if (previousWeight) {
                $('#weight').val(previousWeight);
            }
            $('#result-section').html('<p>Please enter the weight.</p>');
        } else {
            $('#input-section').html('');
            $('#result-section').html('<p>Please select a thing in the list</p>');
        }
    });

    function generateInputFields(category) {
        switch (category) {
            case 'comprehensive-drugs':
                return generateComprehensiveDrugsInput();
            case 'anti-epileptics':
                return generateAntiEpilepticsInput();
            case 'blood-products':
                return generateBloodProductsInput();
            case 'syrups':
                return generateSyrupsInput();
            case 'dka':
                return generateDKAInput();
            default:
                return '';
        }
    }

    function generateComprehensiveDrugsInput() {
        return `
            <div class="card">
                <label for="weight" class="block text-sm font-medium text-gray-700">Patient Weight (kg)</label>
                <input type="number" id="weight" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Weight in kg">
                <button onclick="calculateComprehensiveDrugs()" class="mt-4 btn-calculate">Calculate</button>
            </div>
        `;
    }

    function generateAntiEpilepticsInput() {
        return `
            <div class="card">
                <label for="weight" class="block text-sm font-medium text-gray-700">Patient Weight (kg)</label>
                <input type="number" id="weight" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Weight in kg">
                <button onclick="calculateAntiEpileptics()" class="mt-4 btn-calculate">Calculate</button>
            </div>
        `;
    }

    function generateBloodProductsInput() {
        return `
            <div class="card">
                <label for="weight" class="block text-sm font-medium text-gray-700">Patient Weight (kg)</label>
                <input type="number" id="weight" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Weight in kg">
                <button onclick="calculateBloodProducts()" class="mt-4 btn-calculate">Calculate</button>
            </div>
        `;
    }

    function generateSyrupsInput() {
        return `
            <div class="card">
                <label for="weight" class="block text-sm font-medium text-gray-700">Patient Weight (kg)</label>
                <input type="number" id="weight" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Weight in kg">
                <button onclick="calculateSyrups()" class="mt-4 btn-calculate">Calculate</button>
            </div>
        `;
    }

    function generateDKAInput() {
        return `
            <div class="card">
                <label for="weight" class="block text-sm font-medium text-gray-700">Patient Weight (kg)</label>
                <input type="number" id="weight" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Weight in kg">
                <label for="bolus" class="block text-sm font-medium text-gray-700 mt-4">Bolus Fluid (cc)</label>
                <input type="number" id="bolus" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter Bolus Fluid in cc">
                <button onclick="calculateDKA()" class="mt-4 btn-calculate">Calculate</button>
            </div>
        `;
    }

    window.calculateComprehensiveDrugs = function() {
        const weight = $('#weight').val();
        if (!weight) {
            alert('Please Enter the Patient Weight.');
            return;
        }
        previousWeight = weight;

        const maintenanceFluid = calculateMaintenanceFluid(weight);
        const bolusFluid = calculateBolusFluid(weight);
        const antibiotics = calculateAntibiotics(weight);
        const others = calculateOthers(weight);

        $('#result-section').html(`
            <h2>Results</h2>
            <p><span class="highlight highlight-fluid">Fluid (Bolus)</span> -> ${bolusFluid.toFixed(1)} cc</p>
            <p><span class="highlight highlight-fluid">Fluid (Maintenance)</span> -> ${maintenanceFluid.toFixed(1)} cc</p>
            <p>${antibiotics}</p>
            <p>${others}</p>
        `);
    }

    window.calculateAntiEpileptics = function() {
        const weight = $('#weight').val();
        if (!weight) {
            alert('Please Enter the Patient Weight.');
            return;
        }
        previousWeight = weight;

        const diazepam = roundToHalf(0.3 * weight);
        const luminalLoading = roundToHalf((20 * weight) / 200 * 100);
        const luminalMaintenance = roundToHalf((5 * weight) / 200 * 100);
        const phenytoinLoading = roundToHalf((20 * weight) / 250 * 5 * 100);
        const phenytoinMaintenance = roundToHalf((5 * weight) / 250 * 5 * 100);
        const levetiracetam = roundToHalf((10 * weight) / 100);
        const carbamazepine = roundToHalf((20 * weight) / 100 * 5);

        const diazepamCC = (0.3 * weight).toFixed(1);
        const luminalLoadingCC = ((20 * weight) / 200).toFixed(1);
        const luminalMaintenanceCC = ((5 * weight) / 200).toFixed(1);
        const phenytoinLoadingCC = ((20 * weight) / 250 * 5).toFixed(1);
        const phenytoinMaintenanceCC = ((5 * weight) / 250 * 5).toFixed(1);
        const levetiracetamCC = ((10 * weight) / 100).toFixed(1);
        const carbamazepineCC = ((10 * weight) / 100 * 5).toFixed(1);

        $('#result-section').html(`
            <h2>Results</h2>
            <p><span class="highlight highlight-antibiotic">Diazepam (Valium, 10mg/ml, Ampoule)</span> -> ${diazepam} mg (${diazepamCC} cc) <span class="doses">X 1</span></p>
            <p><span class="highlight highlight-antibiotic">Luminal (200mg/ml, Ampoule) Loading</span> -> ${20 * weight} mg (${luminalLoadingCC} cc -> ${luminalLoading} insulin syringe units) <span class="doses">X 1</span></p>
            <p><span class="highlight highlight-antibiotic">Luminal (200mg/ml, Ampoule) Maintenance</span> -> ${5 * weight} mg (${luminalMaintenanceCC} cc -> ${luminalMaintenance} insulin syringe units) <span class="doses">X 2</span></p>
            <p><span class="highlight highlight-antibiotic">Phenytoin (250mg/5ml, Ampoule) Loading</span> -> ${20 * weight} mg (${phenytoinLoadingCC} cc -> ${phenytoinLoading} insulin syringe units) <span class="doses">X 1</span></p>
            <p><span class="highlight highlight-antibiotic">Phenytoin (250mg/5ml, Ampoule) Maintenance</span> -> ${5 * weight} mg (${phenytoinMaintenanceCC} cc -> ${phenytoinMaintenance} insulin syringe units) <span class="doses">X 2</span></p>
            <p><span class="highlight highlight-antibiotic">Levetiracetam (Keppra, 100mg/ml, Syrup)</span> -> ${10 * weight} mg (${levetiracetamCC} cc) <span class="doses">X 2</span></p>
            <p><span class="highlight highlight-antibiotic">Carbamazepine (Tegretol, 100mg/5ml, Syrup)</span> -> ${20 * weight} mg (${carbamazepineCC} cc) <span class="doses">X 2</span></p>
        `);
    }

    window.calculateBloodProducts = function() {
        const weight = $('#weight').val();
        if (!weight) {
            alert('Please Enter the Patient Weight.');
            return;
        }
        previousWeight = weight;

        const packedRBC = roundToHalf(10 * weight);
        const platelets = roundToHalf(10 * weight);
        const freshFrozenPlasma = roundToHalf(10 * weight);

        $('#result-section').html(`
            <h2>Results</h2>
            <p><span class="highlight highlight-fluid">Packed RBC</span> -> ${packedRBC.toFixed(1)} cc</p>
            <p><span class="highlight highlight-fluid">Platelets</span> -> ${platelets.toFixed(1)} cc</p>
            <p><span class="highlight highlight-fluid">Fresh Frozen Plasma</span> -> ${freshFrozenPlasma.toFixed(1)} cc</p>
        `);
    }

    window.calculateSyrups = function() {
        const weight = $('#weight').val();
        if (!weight) {
            alert('Please Enter the Patient Weight.');
            return;
        }
        previousWeight = weight;

        const syrups = [
            { name: 'Paracetamol (125 mg/5 ml) Syrup', dose: 15, concentration: 125 / 5, frequency: 4 },
            { name: 'Paracetamol (250 mg/5 ml) Syrup', dose: 15, concentration: 250 / 5, frequency: 4 },
            { name: 'Ibuprofen (100 mg/5 ml) Syrup', dose: 5, concentration: 100 / 5, frequency: 3 },
            { name: 'Metronidazole (125 mg/5 ml) Syrup', dose: 10, concentration: 125 / 5, frequency: 3 },
            { name: 'Amoxicillin (125 mg/5 ml) Syrup', dose: 10, concentration: 125 / 5, frequency: 3 },
            { name: 'Amoxicillin (250 mg/5 ml) Syrup', dose: 10, concentration: 250 / 5, frequency: 3 },
            { name: 'Augmentin (156 mg/5 ml) Syrup', dose: 25, concentration: 156 / 5, frequency: 2 },
            { name: 'Augmentin (312 mg/5 ml) Syrup', dose: 25, concentration: 312 / 5, frequency: 2 },
            { name: 'Augmentin (457 mg/5 ml) Syrup', dose: 25, concentration: 457 / 5, frequency: 2 },
            { name: 'Cefixime (100 mg/5 ml) Syrup', dose: 8, concentration: 100 / 5, frequency: 1 },
            { name: 'Azithromycin (200 mg/5 ml) Syrup', dose: 10, concentration: 200 / 5, frequency: 1 },
            { name: 'Ondansetron (4 mg/5 ml) Syrup', dose: 0.15, concentration: 4 / 5, frequency: 3 },
            { name: 'Chlorpheniramine (2 mg/5 ml) Syrup', dose: 0.1, concentration: 2 / 5, frequency: 3 },
            { name: 'Albuterol (2 mg/5 ml) Syrup', dose: 0.1, concentration: 2 / 5, frequency: 3 },
            { name: 'Dexamethasone (0.5 mg/5 ml) Syrup', dose: 0.05, concentration: 0.5 / 5, frequency: 3 },
            { name: 'Ketotifen (1 mg/5 ml) Syrup', dose: 0.05, concentration: 1 / 5, frequency: 1 },
            { name: 'Zinc Syrup', dose: weight < 1 ? 10 : 20, concentration: 1, frequency: 1, isFixed: true },
            { name: 'ORS', dose: 30, concentration: 1, isFixed: true }
        ];

        const results = syrups.map(syrup => {
            if (syrup.isFixed) {
                if (syrup.name === 'Zinc Syrup') {
                    return `<span class="highlight highlight-syrup">${syrup.name}</span> -> ${syrup.dose} mg <span class="doses">X 1</span>`;
                } else {
                    return `<span class="highlight highlight-syrup">${syrup.name}</span> -> ${(syrup.dose * weight).toFixed(1)} cc`;
                }
            } else {
                const mgDose = syrup.dose * weight;
                const ccDose = (weight * (syrup.dose / syrup.concentration)).toFixed(1);
                return `<span class="highlight highlight-syrup">${syrup.name}</span> -> ${mgDose.toFixed(1)} mg (${ccDose} cc) <span class="doses">X ${syrup.frequency}</span>`;
            }
        }).join('<br>');

        $('#result-section').html(`
            <h2>Results</h2>
            <p>${results}</p>
        `);
    }

    window.calculateDKA = function() {
        const weight = $('#weight').val();
        const bolus = $('#bolus').val();
        if (!weight || !bolus) {
            alert('Please Enter the Patient Weight and Bolus Fluid.');
            return;
        }
        previousWeight = weight;

        const fluidPerHour = (calculateMaintenanceFluid(weight) + (85 * weight) - bolus) / 24;
        const insulinPerHour = 0.1 * weight;
        const kclPerHour = fluidPerHour / 100;

        $('#result-section').html(`
            <h2>Results</h2>
            <p><span class="highlight highlight-fluid">Fluid</span> -> ${fluidPerHour.toFixed(1)} cc per hour</p>
            <p><span class="highlight highlight-fluid">Insulin</span> -> ${insulinPerHour.toFixed(1)} units per hour</p>
            <p><span class="highlight highlight-fluid">KCL</span> -> ${kclPerHour.toFixed(1)} cc per hour</p>
        `);
    }

    function calculateMaintenanceFluid(weight) {
        if (weight <= 10) {
            return weight * 100;
        } else if (weight <= 20) {
            return (10 * 100) + ((weight - 10) * 50);
        } else {
            return (10 * 100) + (10 * 50) + ((weight - 20) * 20);
        }
    }

    function calculateBolusFluid(weight) {
        return weight * 20;
    }

    function calculateAntibiotics(weight) {
        const antibiotics = [
            { name: 'Ceftriaxone (500 mg/10 ml vial)', dose: 25, frequency: 2, concentration: 500 / 10 },
            { name: 'Vancomycin (500 mg/10 ml vial)', dose: 20, frequency: 3, concentration: 500 / 10 },
            { name: 'Acyclovir (250 mg/10 ml vial)', dose: 10, frequency: 3, concentration: 250 / 10 },
            { name: 'Metronidazole (Flagyl, 500 mg/100 ml vial)', dose: 5, frequency: 3, concentration: 500 / 100 },
            { name: 'Amoxicillin (500 mg/10 ml vial)', dose: 50, frequency: 2, concentration: 500 / 10 },
            { name: 'Gentamicin (80 mg/2 ml ampoule)', dose: 2.5, frequency: 2, concentration: 80 / 2 },
            { name: 'Amikacin (500 mg/2 ml ampoule)', dose: 7.5, frequency: 2, concentration: 500 / 2 },
            { name: 'Cefotaxime (Claforan, 1 g/10 ml vial)', dose: 50, frequency: 2, concentration: 1000 / 10 }
        ];

        return antibiotics.map(antibiotic => {
            const dose = roundToHalf(antibiotic.dose * weight);
            const ccDose = (dose / antibiotic.concentration).toFixed(1);
            return `<span class="highlight highlight-antibiotic">${antibiotic.name}</span> -> ${dose} mg (${ccDose} cc) <span class="doses">X ${antibiotic.frequency}</span>`;
        }).join('<br>');
    }

    function calculateOthers(weight) {
        const others = [
            { name: 'Paracetamol (500 mg/100 ml vial)', dose: 15, frequency: 4, concentration: 500 / 100 },
            { name: 'Hydrocortisone (100 mg/2 ml vial)', dose: 5, frequency: 2, concentration: 100 / 2 },
            { name: 'Dexamethasone (4 mg/1 ml ampoule)', dose: 0.3, frequency: 2, concentration: 4 / 1 },
            { name: 'Ondansetron (8 mg/4 ml ampoule)', dose: 0.2, frequency: 3, concentration: 8 / 4 },
            { name: 'Aminophylline (250 mg/10 ml ampoule, loading)', dose: 5, frequency: 1, concentration: 250 / 10 },
            { name: 'Aminophylline (250 mg/10 ml ampoule, maintenance)', dose: 2, frequency: 2, concentration: 250 / 10 },
            { name: 'Lasix (20 mg/2 ml ampoule)', dose: 1, frequency: 2, concentration: 20 / 2 },
        ];

        return others.map(other => {
            const dose = roundToHalf(other.dose * weight);
            const ccDose = (dose / other.concentration).toFixed(1);
            return `<span class="highlight highlight-antibiotic">${other.name}</span> -> ${dose} mg (${ccDose} cc) ${other.frequency > 1 ? '<span class="doses">X ' + other.frequency + '</span>' : ''}`;
        }).join('<br>');
    }

    function roundToHalf(num) {
        return Math.floor(num * 2) / 2;
    }
});
